import {
  create,
  createTranslate,
  SJSF_ID_PREFIX,
  type Creatable,
  type FormMerger,
  type FormValidator,
  type MergerFactoryOptions,
  type Schema,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type ValidatorFactoryOptions,
} from "@sjsf/form";
import { isRecord } from "@sjsf/form/lib/object";
import type { MaybePromise } from "@sjsf/form/lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";

import { getRequestEvent } from "$app/server";

import { isFileMarker } from "../../internal.js";
import {
  createFormDataEntryConverter,
  EntryDecodeError,
  type FormDataConverterOptions,
  type UnknownEntryConverter,
} from "../../internal/convert-form-data-entry.js";
import { JSON_CHUNKS_KEY, type EntryConverter } from "../../model.js";
import { DEFAULT_PSEUDO_PREFIX } from "../id-builder.js";
import { encode } from "../internal/codec.js";
import { createSvelteKitDataParser } from "../internal/sveltekit-data-parser.js";
import { enServerTranslation, type ServerTranslation } from "./translation.js";

export interface SvelteKitFormValidatorOptions<T> {
  schema: Schema;
  validator: Creatable<FormValidator<T>, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  createEntryConverter?: Creatable<
    EntryConverter<FormDataEntryValue>,
    FormDataConverterOptions
  >;
  /** Handles submitted values whose schema declares no `type`. */
  convertUnknownEntry?: UnknownEntryConverter;
  pseudoPrefix?: string;
  /** By default, handles conversion of `File`. Marker values starting with the file prefix are resolved as file references. */
  createReviver?: (
    input: Record<string, unknown>
  ) => (key: string, value: any) => any;
  serverTranslation?: ServerTranslation;
}

class PublicError {
  constructor(public readonly message: string) {}
}

function failure(
  message: string,
  path: PropertyKey[] = []
): StandardSchemaV1.FailureResult {
  return {
    issues: [
      {
        message,
        path,
      },
    ],
  };
}

export interface ValidationResult<R> {
  idPrefix: string;
  data: R;
}

function createDefaultReviver(input: Record<string, unknown>) {
  return (_: string, value: any) => {
    if (isFileMarker(value)) {
      // The record is keyed by wire names, which carry the encoded file key
      // (Kit rejects raw separator characters in names), while the payload
      // holds the bare key — so encode here, matching what the client sent.
      // A missing part answers `null`, like the form-action reviver, instead
      // of `undefined`, which `JSON.parse` would silently delete.
      return input[encode(value)] ?? null;
    }
    return value;
  };
}

export function createServerValidator<T>({
  serverTranslation = enServerTranslation,
  schema,
  uiSchema = {},
  merger: createMerger,
  validator: createValidator,
  uiOptionsRegistry = {},
  createEntryConverter = createFormDataEntryConverter,
  convertUnknownEntry,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
  createReviver = createDefaultReviver,
}: SvelteKitFormValidatorOptions<T>): StandardSchemaV1<
  any,
  ValidationResult<T>
> & {
  validate: (
    input: unknown
  ) => MaybePromise<StandardSchemaV1.Result<ValidationResult<T>>>;
} {
  const t = createTranslate(serverTranslation);
  const validator = create(createValidator, {
    schema: schema,
    uiSchema: uiSchema,
    uiOptionsRegistry,
    merger: () => merger,
  });
  const merger: FormMerger = create(createMerger, {
    schema: schema,
    uiSchema: uiSchema,
    validator,
    uiOptionsRegistry,
  });
  const parseSvelteKitData = createSvelteKitDataParser({
    schema,
    uiSchema,
    merger,
    validator,
    convertUnknownEntry,
    createEntryConverter,
    pseudoPrefix,
    uiOptionsRegistry,
  });
  function parseIdPrefix(input: Record<string, unknown>) {
    const idPrefix = input[SJSF_ID_PREFIX];
    if (typeof idPrefix === "string") {
      return idPrefix;
    }
    throw new PublicError(t("missing-or-invalid-id-prefix-key", {}));
  }
  function parseData(
    signal: AbortSignal,
    idPrefix: string,
    input: Record<string, unknown>
  ) {
    const data = input[JSON_CHUNKS_KEY];
    if (
      Array.isArray(data) &&
      data.every((chunk) => typeof chunk === "string")
    ) {
      try {
        return JSON.parse(data.join(""), createReviver(input));
      } catch (e) {
        // Like the form-action path: a malformed chunk payload is undecodable
        // input reported at the root, not a generic failure.
        if (e instanceof SyntaxError) {
          throw new EntryDecodeError(e.message, []);
        }
        throw e;
      }
    }
    return parseSvelteKitData(signal, idPrefix, input);
  }
  async function validate(
    input: unknown
  ): Promise<StandardSchemaV1.Result<ValidationResult<T>>> {
    if (!isRecord(input)) {
      return failure(t("expected-record", { input }));
    }
    try {
      // Inside the `try`, since it throws `request_event_unavailable` when
      // there is no active request, and this function never throws
      const { request } = getRequestEvent();
      const idPrefix = parseIdPrefix(input);
      const value = await parseData(request.signal, idPrefix, input);
      const result =
        "validateFormValueAsync" in validator
          ? await validator.validateFormValueAsync(
              request.signal,
              schema,
              value
            )
          : validator.validateFormValue(schema, value);
      return result.errors
        ? { issues: result.errors }
        : {
            value: {
              data: result.value,
              idPrefix,
            },
          };
    } catch (e) {
      // Report an undecodable value against its own field rather than as a pathless
      // error, which nothing can be attached to.
      if (e instanceof EntryDecodeError) {
        return failure(e.message, [...e.path]);
      }
      return failure(
        e instanceof PublicError ? e.message : t("unexpected-error", {})
      );
    }
  }
  return {
    validate,
    "~standard": {
      version: 1,
      vendor: "svelte-jsonschema-form",
      validate,
    },
  };
}
