import {
  type Schema,
  type UiSchemaRoot,
  type ValidationError,
  type FormValue,
  type ValidatorFactoryOptions,
  type MergerFactoryOptions,
  type FormMerger,
  type UiOptionsRegistry,
  type Creatable,
  create,
  SJSF_ID_PREFIX,
  type ValidationResult,
  type FormValidator,
} from "@sjsf/form";
import type { MaybePromise } from "@sjsf/form/lib/types";
import { fail, type ActionFailure, type RequestEvent } from "@sveltejs/kit";

import {
  createOptionIndexDecoder,
  DEFAULT_INDEX_SEPARATOR,
  DEFAULT_PROPERTY_SEPARATOR,
  DEFAULT_PSEUDO_SEPARATOR,
  type IdOptions,
} from "../id-builder.js";
import { isFileMarker } from "../internal.js";
import { createCodec, DEFAULT_ESCAPE_CHAR } from "../internal/codec.js";
import {
  createEnumItemDecoder,
  createFormDataEntryConverter,
  EntryDecodeError,
  type FormDataConverterOptions,
  type UnknownEntryConverter,
} from "../internal/convert-form-data-entry.js";
import { parseSchemaValue } from "../internal/schema-value-parser.js";
import {
  JSON_CHUNKS_KEY,
  type EntryConverter,
  type EnumItemDecoder,
  type InvalidFormData,
  type SendData,
  type ValidatedFormData,
  type ValidFormData,
} from "../model.js";

export interface FormHandlerOptions<T, SD extends SendData> extends Omit<
  IdOptions,
  "idPrefix"
> {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  idIndexSeparator?: string;
  validator: Creatable<FormValidator<T>, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  createEntryConverter?: Creatable<
    EntryConverter<FormDataEntryValue>,
    FormDataConverterOptions
  >;
  /** Handles submitted values whose schema declares no `type`. */
  convertUnknownEntry?: UnknownEntryConverter;
  enumItemDecoder?: EnumItemDecoder;
  /** @default false */
  sendData?: SD;
  /** By default, handles conversion of `File`. Marker values starting with the file prefix are resolved as file references. */
  createReviver?: (formData: FormData) => (key: string, value: any) => any;
  escapeCharacter?: string;
}

function createDefaultReviver(formData: FormData) {
  return (_: string, value: any) => {
    if (isFileMarker(value)) {
      return formData.get(value);
    }
    return value;
  };
}

export function createFormHandler<T, SD extends SendData>({
  schema,
  uiSchema = {},
  uiOptionsRegistry = {},
  merger: createMerger,
  validator: createValidator,
  createEntryConverter = createFormDataEntryConverter,
  convertUnknownEntry,
  propertySeparator = DEFAULT_PROPERTY_SEPARATOR,
  indexSeparator = DEFAULT_INDEX_SEPARATOR,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
  escapeCharacter = DEFAULT_ESCAPE_CHAR,
  sendData,
  createReviver = createDefaultReviver,
  enumItemDecoder = createEnumItemDecoder(
    createOptionIndexDecoder(pseudoSeparator)
  ),
}: FormHandlerOptions<T, SD>) {
  const validator = create(createValidator, {
    schema,
    uiSchema,
    uiOptionsRegistry,
    merger: () => merger,
  });
  const merger: FormMerger = create(createMerger, {
    schema,
    uiSchema,
    validator,
    uiOptionsRegistry,
  });
  const convertEntry = create(createEntryConverter, {
    validator,
    merger,
    rootSchema: schema,
    rootUiSchema: uiSchema,
    convertUnknownEntry,
    enumItemDecoder,
  });
  return async (
    signal: AbortSignal,
    formData: FormData
  ): Promise<
    [
      ValidatedFormData<T, SD>,
      T | FormValue,
      (errors: ValidationError[]) => ValidatedFormData<T, SD>,
    ]
  > => {
    const idPrefix = formData.get(SJSF_ID_PREFIX);
    if (typeof idPrefix !== "string") {
      throw new Error(
        `"${SJSF_ID_PREFIX}" key is missing in FormData or not a string`
      );
    }
    let data: FormValue = {};
    const chunkParts = formData.getAll(JSON_CHUNKS_KEY);
    // A parts-mode field could theoretically carry this key (e.g. a file
    // input by that name): only string parts decode as chunks, like the
    // remote path already requires.
    if (
      chunkParts.length > 0 &&
      chunkParts.every((part) => typeof part === "string")
    ) {
      try {
        data = JSON.parse(chunkParts.join(""), createReviver(formData));
      } catch (e) {
        // A truncated or tampered chunk payload is undecodable input, not a
        // server failure: report it at the root instead of failing the request.
        if (e instanceof SyntaxError) {
          const errors: ValidationError[] = [{ path: [], message: e.message }];
          return [validated(errors, false), data, validated];
        }
        throw e;
      }
    } else {
      try {
        data = await parseSchemaValue(signal, {
          idPrefix,
          idSeparator: propertySeparator,
          idIndexSeparator: indexSeparator,
          idPseudoSeparator: pseudoSeparator,
          schema,
          uiSchema,
          entries: Array.from(formData.entries()),
          validator,
          merger,
          convertEntry,
          codec: createCodec({
            escapeChar: escapeCharacter,
            sequencesToEncode: [
              propertySeparator,
              indexSeparator,
              pseudoSeparator,
            ],
          }),
        });
      } catch (e) {
        // An undecodable value is reported against its own field instead of
        // failing the request, so the form comes back with the error on it.
        // Nothing is pushed back into the form: there is no parsed data, and
        // pushing the `{}` initializer would wipe what the user typed.
        if (e instanceof EntryDecodeError) {
          const errors: ValidationError[] = [
            { path: [...e.path], message: e.message },
          ];
          return [validated(errors, false), data, validated];
        }
        throw e;
      }
    }
    const result: ValidationResult<T> =
      "validateFormValueAsync" in validator
        ? await validator.validateFormValueAsync(signal, schema, data)
        : validator.validateFormValue(schema, data);
    function validated(errors: ReadonlyArray<ValidationError>, update = true) {
      const isValid = errors.length === 0;
      return {
        idPrefix: idPrefix as string,
        updateData: update && !isValid && sendData === true,
        errors,
        ...(isValid
          ? ({
              isValid,
              data: sendData ? result.value : undefined,
            } as ValidFormData<T, SD>)
          : ({
              isValid,
              data: sendData ? data : undefined,
            } as InvalidFormData<SD>)),
      } satisfies ValidatedFormData<T, SD>;
    }
    return [validated(result.errors ?? []), result.value, validated];
  };
}

export function isValid<T, SD extends SendData>(
  vfd: ValidatedFormData<T, SD>,
  _data: unknown
): _data is T {
  return vfd.isValid;
}

type FormRecord<F extends string, T, SD extends SendData> = {
  [K in F]: ValidatedFormData<T, SD>;
};

interface FormMeta {
  idPrefix: string;
}

export function createAction<
  T,
  SD extends SendData,
  const F extends string,
  E extends RequestEvent,
  R extends Record<string, any> | void,
>(
  options: FormHandlerOptions<T, SD> & {
    name: F;
  },
  userAction: (
    data: T,
    event: E,
    meta: Readonly<FormMeta>
  ) => MaybePromise<ValidationError[] | R | void>
) {
  const handle = createFormHandler(options);
  return async (
    event: E
  ): Promise<
    (FormRecord<F, T, SD> & R) | ActionFailure<FormRecord<F, T, SD>>
  > => {
    const [form, data, validated] = await handle(
      event.request.signal,
      await event.request.formData()
    );
    if (!form.isValid) {
      return fail(400, { [options.name]: form } as FormRecord<F, T, SD>);
    }
    let result = await userAction(data as T, event, form);
    if (Array.isArray(result)) {
      if (result.length > 0) {
        return fail(400, {
          [options.name]: validated(result),
        } as FormRecord<F, T, SD>);
      } else {
        result = undefined;
      }
    }
    return { ...result, [options.name]: form } as FormRecord<F, T, SD> & R;
  };
}
