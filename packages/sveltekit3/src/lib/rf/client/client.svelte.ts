import {
  create,
  DEFAULT_ID_PREFIX,
  SJSF_ID_PREFIX,
  validate,
  type Creatable,
  type FormIdBuilder,
  type FormOptions,
  type FormState,
  type IdBuilderFactoryOptions,
  type UiSchemaRoot,
} from "@sjsf/form";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import type { DeepPartial } from "@sjsf/form/lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { getAbortSignal, onMount, untrack, hydratable } from "svelte";

import type { RemoteForm, RemoteFormInput } from "$app/server";

import { chunks } from "../../internal.js";
import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from "../../model.js";
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

function getRemoteFormFieldId(remoteForm: RemoteForm<any, any>): string {
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

function withFormFieldSuffix(
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>,
  suffix: string
): Creatable<FormIdBuilder, IdBuilderFactoryOptions> {
  return (factoryOptions) => {
    const builder = create(idBuilder, factoryOptions);
    return {
      fromPath: (path) => `${builder.fromPath(path)}${suffix}`,
    };
  };
}

const CHUNK_KEY = `${JSON_CHUNKS_KEY}[]`;

function createDefaultReplacer(formElement: HTMLFormElement) {
  const seen = new Set<string>();
  function fileInput(name: string, value: File) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = name;
    const dt = new DataTransfer();
    dt.items.add(value);
    fileInput.files = dt.files;
    formElement.appendChild(fileInput);
  }
  return (key: string, value: any) => {
    if (!(value instanceof File)) {
      return value;
    }
    const initialKey = `${FORM_DATA_FILE_PREFIX}${key}`;
    let fdKey = initialKey;
    let i = 1;
    while (seen.has(fdKey)) fdKey = `${initialKey}__${i++}`;
    fileInput(encode(fdKey), value);
    return fdKey;
  };
}

export interface ConnectOptions extends SvelteKitDataParserOptions {
  /** By default, handles conversion of `File` */
  createReplacer?: (
    formElement: HTMLFormElement
  ) => (key: string, value: any) => any;
  /** @default 500000 */
  jsonChunkSize?: number;
}

const HYDRATABLE_KEY_PREFIX = "__sjsf_sveltekit_h__";

export async function connect<T>(
  remoteForm: RemoteForm<any, any>,
  options: FormOptions<T> & ConnectOptions
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
    formElement.onreset = () => {
      originalFormElement.reset();
    };
    const attach = remoteForm[symbols[0]];
    return attach(formElement);
  });

  const dataParser = createSvelteKitDataParser(options);

  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);

  // Kit v3 requires form field names to end with `/{formId}` (see
  // `parse_form_key`), otherwise submissions are rejected server-side
  const fieldSuffix = `/${getRemoteFormFieldId(remoteForm)}`;

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

  function hiddenInput(name: string, value: string) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    formElement.append(input);
  }

  let submittedFormCleanup: AbortController | undefined;

  function detachSubmittedForm() {
    formElement.remove();
    formElement.replaceChildren();
  }

  const jsonChunkSize = $derived(options.jsonChunkSize ?? 500000);
  const createReplacer = $derived(
    options.createReplacer ?? createDefaultReplacer
  );

  const uiSchema: UiSchemaRoot = $derived.by(() => {
    const { uiSchema, uiOptionsRegistry } = options;
    return untrack(() =>
      createUiSchemaWithFormAttributes(remoteForm, uiSchema, uiOptionsRegistry)
    );
  });

  return Object.setPrototypeOf(
    {
      idBuilder: withFormFieldSuffix(options.idBuilder, fieldSuffix),
      fieldNameSuffix: fieldSuffix,
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
        submittedFormCleanup?.abort();
        submittedFormCleanup = new AbortController();
        formElement.replaceChildren();
        hiddenInput(`${SJSF_ID_PREFIX}${fieldSuffix}`, idPrefix);
        for (const chunk of chunks(
          JSON.stringify(value, createReplacer(formElement)),
          jsonChunkSize
        )) {
          hiddenInput(`${CHUNK_KEY}${fieldSuffix}`, chunk);
        }
        document.body.appendChild(formElement);
        // NOTE: The form must stay connected until Kit resets it after the
        // submission completes, otherwise the reset is skipped (it is guarded
        // by `isConnected`) and the original form won't be restored
        formElement.addEventListener(
          "reset",
          () => setTimeout(detachSubmittedForm, 0),
          { once: true, signal: submittedFormCleanup.signal }
        );
        formElement.requestSubmit();
        options.onSubmit?.(value, e);
      },
    } satisfies Partial<FormOptions<T>>,
    options
  );
}
