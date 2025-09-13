/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DeepPartial } from '@sjsf/form/lib/types';
import type { Validator } from '@sjsf/form/core';
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  isFormValueValidator,
  type Schema,
  type SchemaValue,
  type UiSchemaRoot,
  type ValidationError,
  type IdOptions,
  type AnyFormValueValidatorError,
  type AnyFormValueValidator,
  isAsyncFormValueValidator,
  type FormValue,
  type ValidatorFactoryOptions,
  type MergerFactoryOptions,
  type FormMerger
} from '@sjsf/form';

import {
  FORM_DATA_FILE_PREFIX,
  JSON_CHUNKS_KEY,
  type InitialFormData,
  type SerializableOptionalFormOptions,
  type ValidatedFormData
} from '../model.js';

import { parseSchemaValue } from './schema-value-parser.js';
import {
  createFormDataEntriesConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from './convert-form-data-entries.js';
import type { EntriesConverter } from './entry.js';

export type InitFormOptions<
  T,
  E,
  SendSchema extends boolean
> = SerializableOptionalFormOptions<T> & {
  sendSchema?: SendSchema;
  initialValue?: DeepPartial<T>;
  initialErrors?: ValidationError<E>[];
  uiSchema?: UiSchemaRoot;
} & (SendSchema extends true
    ? { schema: Schema }
    : {
        schema?: never;
      });

export function initForm<T, E, SendSchema extends boolean = false>(
  options: InitFormOptions<T, E, SendSchema>
): InitialFormData<T, E, SendSchema> {
  const data = {
    ...options,
    schema: (options.sendSchema ? options.schema : undefined) as SendSchema extends true
      ? Schema
      : undefined
  };
  delete data['sendSchema'];
  return data;
}

export interface FormHandlerOptions<
  V extends Validator & AnyFormValueValidator<any>,
  SendData extends boolean
> extends IdOptions {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  createValidator: (options: ValidatorFactoryOptions) => V;
  createMerger: (options: MergerFactoryOptions<V>) => FormMerger;
  createEntriesConverter?: (
    options: FormDataConverterOptions
  ) => EntriesConverter<FormDataEntryValue>;
  convertUnknownEntry?: UnknownEntryConverter;
  /** @default false */
  sendData?: SendData;
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

export function createFormHandler<
  V extends Validator & AnyFormValueValidator<any>,
  SendData extends boolean
>({
  schema,
  uiSchema = {},
  createMerger,
  createValidator,
  createEntriesConverter = createFormDataEntriesConverter,
  convertUnknownEntry,
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
  sendData,
  createReviver = createDefaultReviver
}: FormHandlerOptions<V, SendData>) {
  const validator = createValidator({
    schema,
    uiSchema,
    idPrefix,
    idPseudoSeparator,
    idSeparator,
    merger: () => merger
  });
  const merger = createMerger({
    schema,
    uiSchema,
    validator
  });
  const convertEntries = createEntriesConverter({
    validator,
    merger,
    rootSchema: schema,
    rootUiSchema: uiSchema,
    convertUnknownEntry
  });
  return async (
    signal: AbortSignal,
    formData: FormData
  ): Promise<[ValidatedFormData<AnyFormValueValidatorError<V>, SendData>, FormValue]> => {
    const data = formData.has(JSON_CHUNKS_KEY)
      ? JSON.parse(formData.getAll(JSON_CHUNKS_KEY).join(''), createReviver(formData))
      : await parseSchemaValue(signal, {
          idPrefix,
          idSeparator,
          idPseudoSeparator,
          schema,
          uiSchema,
          entries: Array.from(formData.entries()),
          validator,
          merger,
          convertEntries
        });
    const errors = isAsyncFormValueValidator(validator)
      ? await validator.validateFormValueAsync(signal, schema, data)
      : isFormValueValidator(validator)
        ? validator.validateFormValue(schema, data)
        : [];
    return [
      {
        isValid: errors.length === 0,
        sendData,
        data: (sendData ? data : undefined) as SendData extends true
          ? SchemaValue | undefined
          : undefined,
        errors
      },
      data
    ];
  };
}

export function isValid<T>(vfd: ValidatedFormData<any, boolean>, data: unknown): data is T {
  return vfd.isValid;
}
