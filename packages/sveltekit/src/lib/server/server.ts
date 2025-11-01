import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybePromise } from '@sjsf/form/lib/types';
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
  type FormValidator
} from '@sjsf/form';
import {
  type IdOptions,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_ID_PSEUDO_SEPARATOR
} from '@sjsf/form/id-builders/legacy';
import { DEFAULT_INDEX_SEPARATOR } from '@sjsf/form/id-builders/modern';

import {
  FORM_DATA_FILE_PREFIX,
  JSON_CHUNKS_KEY,
  type EntryConverter,
  type EnumItemDecoder,
  type InvalidFormData,
  type SendData,
  type ValidatedFormData,
  type ValidFormData
} from '$lib/model.js';

import {
  createEnumItemDecoder,
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from '../internal/convert-form-data-entry.js';
import { decodeOptionIndex } from '../id-builder.js';
import { parseSchemaValue } from './schema-value-parser.js';

export interface FormHandlerOptions<T, SD extends SendData> extends IdOptions {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  idIndexSeparator?: string;
  validator: Creatable<FormValidator<T>, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
  enumItemDecoder?: EnumItemDecoder;
  /** @default false */
  sendData?: SD;
  /** By default, handles conversion of `File` */
  createReviver?: (formData: FormData) => (key: string, value: any) => any;
}

function createDefaultReviver(formData: FormData) {
  return (_: string, value: any) => {
    if (typeof value === 'string' && value.startsWith(FORM_DATA_FILE_PREFIX)) {
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
  idSeparator = DEFAULT_ID_SEPARATOR,
  idIndexSeparator = DEFAULT_INDEX_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
  sendData,
  createReviver = createDefaultReviver,
  enumItemDecoder = createEnumItemDecoder(decodeOptionIndex)
}: FormHandlerOptions<T, SD>) {
  const validator = create(createValidator, {
    schema,
    uiSchema,
    uiOptionsRegistry,
    merger: () => merger
  });
  const merger: FormMerger = create(createMerger, {
    schema,
    uiSchema,
    validator,
    uiOptionsRegistry
  });
  const convertEntry = create(createEntryConverter, {
    validator,
    merger,
    rootSchema: schema,
    rootUiSchema: uiSchema,
    convertUnknownEntry,
    enumItemDecoder
  });
  return async (
    signal: AbortSignal,
    formData: FormData
  ): Promise<
    [
      ValidatedFormData<T, SD>,
      T | FormValue,
      (errors: ValidationError[]) => ValidatedFormData<T, SD>
    ]
  > => {
    const idPrefix = formData.get(SJSF_ID_PREFIX);
    if (typeof idPrefix !== 'string') {
      throw new Error(`"${SJSF_ID_PREFIX}" key is missing in FormData or not a string`);
    }
    const data: FormValue = formData.has(JSON_CHUNKS_KEY)
      ? JSON.parse(formData.getAll(JSON_CHUNKS_KEY).join(''), createReviver(formData))
      : await parseSchemaValue(signal, {
          idPrefix,
          idSeparator,
          idIndexSeparator,
          idPseudoSeparator,
          schema,
          uiSchema,
          entries: Array.from(formData.entries()),
          validator,
          merger,
          convertEntry
        });
    const result: ValidationResult<T> =
      'validateFormValueAsync' in validator
        ? await validator.validateFormValueAsync(signal, schema, data)
        : validator.validateFormValue(schema, data);
    function validated(errors: ReadonlyArray<ValidationError>) {
      const isValid = errors.length === 0;
      return {
        idPrefix: idPrefix as string,
        updateData: !isValid && sendData === true,
        errors,
        ...(isValid
          ? ({
              isValid,
              data: sendData ? result.value : undefined
            } as ValidFormData<T, SD>)
          : ({
              isValid,
              data: sendData ? data : undefined
            } as InvalidFormData<SD>))
      } satisfies ValidatedFormData<T, SD>;
    }
    return [validated(result.errors ?? []), result.value, validated];
  };
}

export function isValid<T, SD extends SendData>(
  vfd: ValidatedFormData<T, SD>,
  data: unknown
): data is T {
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
  R extends Record<string, any> | void
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
  ): Promise<(FormRecord<F, T, SD> & R) | ActionFailure<FormRecord<F, T, SD>>> => {
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
          [options.name]: validated(result)
        } as FormRecord<F, T, SD>);
      } else {
        result = undefined;
      }
    }
    return { ...result, [options.name]: form } as FormRecord<F, T, SD> & R;
  };
}
