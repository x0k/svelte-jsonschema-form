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
  convertUnknownEntry?: UnknownEntryConverter;
  enumItemDecoder?: EnumItemDecoder;
  /** @default false */
  sendData?: SD;
  escapeCharacter?: string;
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
