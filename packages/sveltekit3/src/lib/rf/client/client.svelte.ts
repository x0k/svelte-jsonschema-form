import {
  create,
  DEFAULT_ID_PREFIX,
  SJSF_ID_PREFIX,
  validate,
  type Creatable,
  type FormIdBuilder,
  type FormOptions,
  type FormState,
  type UiSchemaRoot,
} from "@sjsf/form";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import type { DeepPartial } from "@sjsf/form/lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { getAbortSignal, onMount, untrack, hydratable } from "svelte";

import type { RemoteForm, RemoteFormInput } from "$app/server";

import { chunks, createFileMarker } from "../../internal.js";
import { JSON_CHUNKS_KEY } from "../../model.js";
import type { FormIdBuilderOptions } from "../id-builder.ts";
import { encode } from "../internal/codec.js";
import {
  createSvelteKitDataParser,
  type SvelteKitDataParserOptions,
} from "../internal/sveltekit-data-parser.js";
import { createUiSchemaWithFormAttributes } from "./ui-schema.ts";

export function createClientValidator<T>(form: FormState<T>) {
  return {
    "~standard": {
      version: 1,
      vendor: "svelte-jsonschema-form",
      validate(): StandardSchemaV1.Result<void> {
        const result = validate(form);
        if (result.errors) {
          return {
            issues: result.errors,
          };
        }
        return {
          value: undefined,
        };
      },
    },
  } satisfies StandardSchemaV1<RemoteFormInput, void>;
}

const CHUNK_KEY = `${JSON_CHUNKS_KEY}[]`;

/** Builds a file input on the hidden submission form. */
function appendFileInput(
  formElement: HTMLFormElement,
  name: string,
  value: File
) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.name = name;
  const dt = new DataTransfer();
  dt.items.add(value);
  fileInput.files = dt.files;
  formElement.appendChild(fileInput);
}

/**
 * A file input with a real selection. Untouched inputs report `File("")`,
 * which the parts path drops — mirroring that here keeps empty state-held
 * files from resolving to an empty `File` where parts would omit.
 */
function isSelectedFile(value: unknown): value is File {
  return value instanceof File && (value.name !== "" || value.size > 0);
}

/** The context a `File` replacer needs to build a submission input. */
export interface ConnectReplacerOptions {
  /** The hidden form the submission is read from. */
  formElement: HTMLFormElement;
  /**
   * Kit v3 requires every field name to end with `/{formId}` (see
   * `parse_form_key`). It belongs on the input's `name`; the JSON payload keeps
   * the bare key, which is what the server looks a file up by.
   */
  fieldSuffix: string;
}

/** The `JSON.stringify` replacer `connect()` submits the value with. */
export type Replacer = (key: string, value: any) => any;

function createDefaultReplacer({
  formElement,
  fieldSuffix,
}: ConnectReplacerOptions): Replacer {
  const marker = createFileMarker();
  return (key, value) => {
    if (!(value instanceof File)) {
      return value;
    }
    // An empty nameless `File` never reaches the state through the widgets
    // (untouched and cleared both write `undefined`); only programmatic
    // state can hold one. Omit it so the key stays absent, like the parts
    // path does for it, instead of appending an empty input where parts
    // would leave nothing behind.
    if (!isSelectedFile(value)) {
      return undefined;
    }
    const fdKey = marker(key);
    appendFileInput(formElement, encode(fdKey) + fieldSuffix, value);
    return fdKey;
  };
}

/**
 * A remote form, or the instance `RemoteForm.for(...)` hands back — the latter
 * has no `for` of its own, since it is already bound to a key.
 */
export type RemoteFormInstance =
  | RemoteForm<any, any>
  | Omit<RemoteForm<any, void>, "for">;

export function getRemoteFormFieldId(remoteForm: RemoteFormInstance): string {
  const action = remoteForm.action;
  const query = action.slice(action.indexOf("?") + 1);
  const actionId = new URLSearchParams(query).get("/remote");
  if (actionId === null) {
    throw new Error(
      "`remoteForm.action` is expected to contain a `/remote` parameter"
    );
  }
  // Strip the optional `/key` part added by `remoteForm.for(...)`, keys are
  // JSON-encoded values
  const slash = actionId.lastIndexOf("/");
  if (slash !== -1) {
    try {
      JSON.parse(actionId.slice(slash + 1));
      return actionId.slice(0, slash);
    } catch {
      // not a `.for(...)` key
    }
  }
  return actionId;
}

export interface ConnectOptions extends SvelteKitDataParserOptions {
  idBuilder: Creatable<FormIdBuilder, FormIdBuilderOptions>;
  /** Submit the value as JSON chunks instead of the form's own parts. @default false */
  useJsonChunks?: boolean;
  /** By default, handles conversion of `File`. Marker values starting with the file prefix are reserved for file references. */
  createReplacer?: (options: ConnectReplacerOptions) => Replacer;
  /** Chunk length in code points, not bytes. Lower it if the server caps body size. @default 500000 */
  jsonChunkSize?: number;
}

const HYDRATABLE_KEY_PREFIX = "__sjsf_sveltekit_h__";

export async function connect<T>(
  remoteForm: RemoteFormInstance,
  options: Omit<FormOptions<T>, "idBuilder"> & ConnectOptions
): Promise<FormOptions<T>> {
  let formElement: HTMLFormElement;
  let originalFormElement: HTMLFormElement;

  onMount(() => {
    const symbols = Object.getOwnPropertySymbols(remoteForm);
    if (symbols.length !== 1) {
      throw new Error(
        `The remote form specification was changed; only one custom symbol was expected, but got "${symbols.length}"`
      );
    }
    formElement = document.createElement("form");
    formElement.style.display = "none";
    // Registered before `attach()` so this runs ahead of Kit's own `reset`
    // listener, which is the only way to keep the two from fighting: Kit's
    // `handle_reset` reads the form back with `new FormData(form)` after an
    // `await tick()` and assigns it to the form value, which would read this
    // form's own inputs back as if they were a fresh submission.
    formElement.addEventListener("reset", (e) => {
      // Undo the submission on the form the user can actually see. The theme
      // wires this to `form.reset()`, which restores `options.initialValue`.
      originalFormElement.reset();
      // Kit must not observe the reset, or it rebuilds its value from the
      // hidden form's inputs.
      e.stopImmediatePropagation();
      // The submission is done, so release the inputs and the `File` blobs
      // they referenced.
      detachSubmittedForm();
    });
    // Kit types the attachment as returning `void`, which hides the cleanup its
    // implementation does return; the cast recovers it so `onMount` can hand it
    // back and Kit's listeners come off with the component.
    const attach = remoteForm[symbols[0]] as (
      node: HTMLFormElement
    ) => () => void;
    const detachRemoteForm = attach(formElement);
    return () => {
      detachRemoteForm();
      detachSubmittedForm();
    };
  });

  const dataParser = createSvelteKitDataParser(options);

  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);

  // Kit v3 requires form field names to end with `/{formId}` (see
  // `parse_form_key`), otherwise submissions are rejected server-side
  const fieldSuffix = `/${getRemoteFormFieldId(remoteForm)}`;
  // The id prefix input's name. `resolveIdPrefixName` from `@sjsf/form` would
  // be the canonical source, but it needs the built `FormIdBuilder` instance,
  // which only `createForm` holds — `connect()` sees factories, never the
  // instance. This matches what the stock builder returns for the same
  // `fieldSuffix` (`rf/id-builder.ts`), which is also what the visible form
  // renders, so inject and skip below always agree.
  const idPrefixName = `${SJSF_ID_PREFIX}${fieldSuffix}`;

  const fields = $derived(remoteForm.fields);

  async function getInitialValue() {
    const formValue = fields.value();
    if (isRecordEmpty(formValue)) {
      return undefined;
    }
    return (await dataParser(
      getAbortSignal(),
      idPrefix,
      formValue
    )) as DeepPartial<T>;
  }
  // svelte-ignore await_waterfall
  const initialValue = $derived(
    await hydratable(`${HYDRATABLE_KEY_PREFIX}${idPrefix}`, getInitialValue)
  );

  function detachSubmittedForm() {
    formElement.remove();
    formElement.replaceChildren();
  }

  function hiddenInput(name: string, value: string) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    formElement.append(input);
  }

  // The hidden form carries what the visible form holds, so the server parses
  // it through `parseSvelteKitData`. The id prefix input is skipped: it is
  // injected separately, trusting the rendered value.
  function copyVisibleInputs(data: FormData) {
    for (const [name, value] of data) {
      if (name === idPrefixName) {
        continue;
      }
      if (value instanceof File) {
        appendFileInput(formElement, name, value);
      } else {
        hiddenInput(name, value);
      }
    }
  }

  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  const createReplacer = $derived(
    options.createReplacer ?? createDefaultReplacer
  );
  const useJsonChunks = $derived(options.useJsonChunks ?? false);

  const uiSchema: UiSchemaRoot = $derived.by(() => {
    const { uiSchema, uiOptionsRegistry } = options;
    return untrack(() =>
      createUiSchemaWithFormAttributes(remoteForm, uiSchema, uiOptionsRegistry)
    );
  });

  const idBuilder: FormOptions<T>["idBuilder"] = (opts) =>
    create(options.idBuilder, {
      ...opts,
      fieldSuffix,
    });

  return Object.setPrototypeOf(
    {
      idBuilder,
      get initialValue() {
        return initialValue ?? options.initialValue;
      },
      get initialErrors() {
        return fields.allIssues() ?? options.initialErrors;
      },
      get uiSchema() {
        return uiSchema;
      },
      onSubmit(value, e) {
        if (!(e.target instanceof HTMLFormElement)) {
          throw new Error("HTMLFormElement expected as submit event target");
        }
        originalFormElement = e.target;
        formElement.enctype = originalFormElement.enctype;
        formElement.method = originalFormElement.method;
        formElement.action = originalFormElement.action;
        formElement.target = originalFormElement.target;
        formElement.acceptCharset = originalFormElement.acceptCharset;
        formElement.name = originalFormElement.name;
        formElement.rel = originalFormElement.rel;
        formElement.replaceChildren();
        // Read once: the prefix lookup and the parts copy below observe the
        // same rendered controls.
        const visibleData = new FormData(originalFormElement);
        // The form renders its own id prefix input, so trust it: only fill in
        // the configured value when the form has none. `FormData.get` reads the
        // first value like the server does, so duplicate prefix inputs agree
        // on both sides; a disabled input is invisible to `FormData`, so it
        // counts as absent.
        const renderedPrefix = visibleData.get(idPrefixName);
        hiddenInput(
          idPrefixName,
          typeof renderedPrefix === "string" ? renderedPrefix : idPrefix
        );
        if (useJsonChunks) {
          // `JSON.stringify` answers `undefined` (not a string) for `undefined`
          // and friends: fall back to `"null"` so `chunks` keeps a decodable
          // payload instead of throwing on `.length`.
          for (const chunk of chunks(
            JSON.stringify(
              value,
              createReplacer({ formElement, fieldSuffix })
            ) ?? "null",
            jsonChunkSize
          )) {
            hiddenInput(`${CHUNK_KEY}${fieldSuffix}`, chunk);
          }
        } else {
          copyVisibleInputs(visibleData);
        }
        // Kit only resets the form while it is connected, and that reset is what
        // carries the submission back to the visible form (see the `reset`
        // listener in `onMount`). This is the only append: the form is detached
        // again by that listener, so it is connected exactly across the
        // submission.
        document.body.appendChild(formElement);
        formElement.requestSubmit();
        options.onSubmit?.(value, e);
      },
    } satisfies Partial<FormOptions<T>>,
    options
  );
}
