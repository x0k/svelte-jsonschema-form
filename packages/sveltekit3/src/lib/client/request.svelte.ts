import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX, type FormValue } from "@sjsf/form";
import { createTask, type TaskOptions } from "@sjsf/form/lib/task.svelte";

import { dev } from "$app/env";
import type { ActionResult } from "$app/forms";
import { applyAction, deserialize } from "$app/forms";
import { goto, refreshAll } from "$app/navigation";

import { chunks, createFileMarker } from "../internal.js";
import { JSON_CHUNKS_KEY } from "../model.js";
import type { SvelteKitFormMeta } from "./meta.js";

export type SveltekitRequestOptions<ActionData, V> = Omit<
  TaskOptions<
    [V | FormValue, SubmitEvent],
    ActionResult<NonNullable<ActionData>>,
    unknown
  >,
  "execute"
> & {
  /** @default DEFAULT_ID_PREFIX */
  idPrefix?: string;
  /**
   * Submit the value as JSON chunks instead of the form's own parts.
   *
   * @default false
   * */
  useJsonChunks?: boolean;
  /** By default, handles conversion of `File`. Marker values starting with the file prefix are reserved for file references. */
  createReplacer?: (options: RequestReplacerOptions) => Replacer;
  /**
   * Chunk length in code points, not bytes. Lower it if the server caps body size.
   *
   * @default 500000
   * */
  jsonChunkSize?: number;
  /** @default true */
  reset?: boolean;
  /**
   * Reruns the destination's `load` functions. Defaults to `true` for
   * successes and `false` for failures, like `enhance`.
   */
  refreshAll?: boolean;
  /**
   * When `false`, apply non-redirect results to the current page rather than
   * navigating to `result.location`. Redirects are always followed.
   *
   * @default true
   */
  navigate?: boolean;
};

/**
 * Kit's `is_current_location`: same origin, path and query params. Modelled on
 * its `resolve_url`, which resolves against `document.baseURI` to honour
 * `<base>`.
 */
function isCurrentLocation(value: string): boolean {
  const destination = new URL(value, document.baseURI);
  const current = new URL(location.href);
  if (
    destination.origin !== current.origin ||
    destination.pathname !== current.pathname
  ) {
    return false;
  }
  const keys = new Set([
    ...destination.searchParams.keys(),
    ...current.searchParams.keys(),
  ]);
  for (const key of keys) {
    const destinationValues = destination.searchParams.getAll(key).sort();
    const currentValues = current.searchParams.getAll(key).sort();
    if (
      destinationValues.length !== currentValues.length ||
      destinationValues.some((value, i) => value !== currentValues[i])
    ) {
      return false;
    }
  }
  return true;
}

/**
 * A file input with a real selection. Untouched inputs report `File("")`,
 * which Kit filters out of the submission — mirroring that here keeps them
 * from tripping file handling.
 */
function isSelectedFile(value: unknown): value is File {
  return value instanceof File && (value.name !== "" || value.size > 0);
}

/** The context a `File` replacer needs to build a submission entry. */
export interface RequestReplacerOptions {
  /** The payload the submission is sent as. */
  formData: FormData;
}

/** The `JSON.stringify` replacer the value is submitted with. */
export type Replacer = (key: string, value: any) => any;

function createDefaultReplacer({ formData }: RequestReplacerOptions): Replacer {
  const marker = createFileMarker();
  return (key, value) => {
    if (!(value instanceof File)) {
      return value;
    }
    // An empty nameless `File` never reaches the state through the widgets
    // (untouched and cleared both write `undefined`); only programmatic
    // state can hold one. Omit it so the key stays absent, like the parts
    // path does for it (the entry converter drops it to `undefined`).
    // Omitting also keeps such a part out of `hasFiles`, so an empty-only
    // payload cannot stringify a `File` to `"[object File]"` on the
    // `URLSearchParams` path.
    if (!isSelectedFile(value)) {
      return undefined;
    }
    const fdKey = marker(key);
    formData.append(fdKey, value);
    return fdKey;
  };
}

export function createSvelteKitRequest<
  Meta extends SvelteKitFormMeta<any, any, any, any>,
>(
  _meta: Meta,
  options: SveltekitRequestOptions<Meta["__actionData"], Meta["__formValue"]>
) {
  const useJsonChunks = $derived(options.useJsonChunks ?? false);
  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  const createReplacer = $derived(
    options.createReplacer ?? createDefaultReplacer
  );
  return createTask({
    // A copy of Kit's `enhance` fallback. Based on
    // `@sveltejs/kit`'s `src/runtime/app/forms/client.js` — note that Kit 3
    // split the single `forms.js` this used to live in. Diff against the
    // installed version when bumping Kit; see the notes on the branches below
    // for the parts that cannot be followed. Known divergences from Kit: the
    // dev file check and `hasFiles` use `isSelectedFile` (untouched `File("")`
    // inputs ignored) where Kit checks `instanceof File`.
    async execute(
      signal: AbortSignal,
      data: Meta["__formValue"] | FormValue,
      e: SubmitEvent
    ) {
      const formElement = e.currentTarget;
      if (!(formElement instanceof HTMLFormElement)) {
        throw new Error(`Event currentTarget is not an HTMLFormElement`);
      }
      const getAttribute = makeFormAttributeAccessor(
        clone(formElement),
        getSubmitter(e)
      );
      const method = getAttribute("method");
      const action = new URL(getAttribute("action"));
      const enctype = getAttribute("enctype");

      // Read once: the dev check, the prefix lookup and the parts payload
      // below all observe the rendered controls.
      const rendered = new FormData(formElement);

      if (dev) {
        if (method !== "post") {
          throw new Error(
            'use:enhance can only be used on <form> fields with method="POST"'
          );
        }
        if (enctype !== "multipart/form-data") {
          // Only rendered controls can reach a native submission, so only
          // they are checked: state-held files exist solely in JS-land.
          // Chunk mode builds its payload from the state, but the warning is
          // about what native would send.
          for (const value of rendered.values()) {
            if (isSelectedFile(value)) {
              throw new Error(
                'Your form contains <input type="file"> fields, but is missing the necessary `enctype="multipart/form-data"` attribute. This will lead to inconsistent behavior between enhanced and native forms. For more details, see https://github.com/sveltejs/kit/issues/9819.'
              );
            }
          }
        }
      }

      // The form renders its own id prefix input, which is required for the
      // integration, so trust it: only the configured value fills in when the
      // form has none, instead of overriding what it rendered. `FormData.get`
      // reads the first value like the server does, so duplicate prefix inputs
      // agree on both sides; a disabled input is invisible to `FormData`, so
      // it counts as absent.
      const renderedPrefix = rendered.get(SJSF_ID_PREFIX);
      const hasPrefix = typeof renderedPrefix === "string";
      const idPrefix = hasPrefix
        ? renderedPrefix
        : (options.idPrefix ?? DEFAULT_ID_PREFIX);
      let formData: FormData;
      if (useJsonChunks) {
        formData = new FormData();
        formData.append(SJSF_ID_PREFIX, idPrefix);
        // `JSON.stringify` answers `undefined` (not a string) for `undefined`
        // and friends: fall back to `"null"` so `chunks` keeps a decodable
        // payload instead of throwing on `.length`.
        for (const chunk of chunks(
          JSON.stringify(data, createReplacer({ formData })) ?? "null",
          jsonChunkSize
        )) {
          formData.append(JSON_CHUNKS_KEY, chunk);
        }
      } else {
        // Untouched file inputs serialize as `File("")`, which would ride
        // `URLSearchParams` as `"[object File]"` on a non-multipart form:
        // drop them while copying, like Kit does server-side.
        formData = new FormData();
        for (const [key, value] of rendered) {
          if (value instanceof File && !isSelectedFile(value)) continue;
          formData.append(key, value);
        }
        if (!hasPrefix) {
          formData.append(SJSF_ID_PREFIX, idPrefix);
        }
      }

      let result: ActionResult<NonNullable<Meta["__actionData"]>>;
      try {
        const headers = new Headers({
          accept: "application/json",
          "x-sveltekit-action": "true",
        });

        // do not explicitly set the `Content-Type` header when sending `FormData`
        // or else it will interfere with the browser's header setting
        // see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects#sect4
        //
        // Files cannot ride in `URLSearchParams` — they stringify to
        // "[object File]". A non-multipart form carrying any real selection,
        // rendered or state-held, in either submission mode, uploads as
        // multipart instead. Untouched inputs report `File("")` and stay put.
        let hasFiles = false;
        for (const value of formData.values()) {
          if (isSelectedFile(value)) {
            hasFiles = true;
            break;
          }
        }
        if (enctype !== "multipart/form-data" && !hasFiles) {
          headers.set(
            "Content-Type",
            /^(:?application\/x-www-form-urlencoded|text\/plain)$/.test(enctype)
              ? enctype
              : "application/x-www-form-urlencoded"
          );
        }

        const body =
          enctype === "multipart/form-data" || hasFiles
            ? formData
            : // @ts-expect-error `URLSearchParams(form_data)` is kosher, but typescript doesn't know that
              new URLSearchParams(formData);

        const response = await fetch(action, {
          method: "POST",
          headers,
          cache: "no-cache",
          body,
          signal,
        });

        const text = await response.text();

        let parsed: any;
        try {
          // an empty body carries no result for an error response
          parsed = text === "" && !response.ok ? undefined : deserialize(text);
        } catch (error) {
          // a proxy may redirect to a login page or return a non-JSON error
          // response, neither of which is an action result
          if (response.ok && !response.redirected) throw error;
        }

        if (
          parsed?.type === "success" ||
          parsed?.type === "failure" ||
          parsed?.type === "redirect" ||
          parsed?.type === "error"
        ) {
          result = parsed;
          if (result.type === "error" || result.type === "failure") {
            result.status = response.status;
          }
        } else if (response.redirected) {
          // fetch followed the HTTP redirect, so its original status is gone
          result = { type: "redirect", status: 303, location: response.url };
        } else if (!response.ok) {
          // The action never ran, e.g. the CSRF check or a proxy rejected it.
          // Kit throws `HttpError`/`SvelteKitError` here so that
          // `handle_error` renders the nearest error page; neither is public
          // API, but `applyAction` renders that same page for an `error`
          // result, so report it here and keep the real status.
          result = {
            type: "error",
            error: {
              status: response.status,
              message:
                (parsed && typeof parsed === "object" && "message" in parsed
                  ? String(parsed.message)
                  : typeof parsed === "string"
                    ? parsed
                    : response.statusText) || `Error: ${response.status}`,
            },
          };
        } else {
          result = parsed;
        }
      } catch (error) {
        // An aborted submission is not a failure of the action; the task that
        // owns `signal` has already been cancelled or has timed out, and
        // rendering an error page on top of that would be misleading
        if ((error as { name?: string } | null)?.name === "AbortError") {
          throw error;
        }
        result = {
          type: "error",
          error: {
            status: 500,
            message: error instanceof Error ? error.message : String(error),
          },
        };
      }

      if (result.type === "success" && options.reset !== false) {
        // We call reset from the prototype to avoid DOM clobbering
        HTMLFormElement.prototype.reset.call(formElement);
      }

      // `true` for successes, `false` for failures, like `enhance`
      const shouldRefreshAll = options.refreshAll ?? result.type === "success";

      // An error always renders the nearest error page, and a redirect is
      // always followed; neither is a navigation to `result.location`
      if (
        result.type === "error" ||
        options.navigate === false ||
        result.location === undefined ||
        result.type === "redirect"
      ) {
        if (shouldRefreshAll && result.type !== "redirect") {
          await refreshAll();
        }
        await applyAction(result);
        return result;
      }

      // Success/failure on the current page updates `page.form` in place. Anywhere
      // else has to navigate, the way a native submission would.
      const destination = new URL(result.location, document.baseURI);
      if (
        destination.origin !== location.origin ||
        isCurrentLocation(result.location)
      ) {
        if (shouldRefreshAll) {
          await refreshAll();
        }
        await applyAction(result);
      } else {
        // NOTE: Kit navigates with `apply_action_navigation`, which also hands
        // the result to the destination's `form` prop. That is an internal
        // `goto` option, so `page.form` is `null` on arrival here.
        await goto(destination.href, { refreshAll: shouldRefreshAll });
      }
      return result;
    },
    get onSuccess() {
      return options.onSuccess;
    },
    get onFailure() {
      return options.onFailure;
    },
    get combinator() {
      return options.combinator;
    },
    get delayedMs() {
      return options.delayedMs;
    },
    get timeoutMs() {
      return options.timeoutMs;
    },
  });
}

function clone<T extends HTMLElement>(element: T): T {
  return HTMLElement.prototype.cloneNode.call(element) as T;
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

function getSubmitter(e: SubmitEvent) {
  if (
    e.submitter instanceof HTMLButtonElement ||
    e.submitter instanceof HTMLInputElement
  ) {
    return e.submitter;
  }
  return null;
}

function makeFormAttributeAccessor(
  form: HTMLFormElement,
  submitter: HTMLButtonElement | HTMLInputElement | null
) {
  return (attribute: "method" | "action" | "enctype") =>
    submitter?.hasAttribute(`form${attribute}`)
      ? submitter[`form${capitalize(attribute)}`]
      : form[attribute];
}
