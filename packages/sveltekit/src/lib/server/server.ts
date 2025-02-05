import { fileToDataURL } from '@sjsf/form/lib/file';
import { defaultMerger, type Merger2, type Validator } from '@sjsf/form/core';
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  type FormValidator,
  type FormValidator2,
  type Schema,
  type SchemaValue,
  type UiSchemaRoot,
  type ValidationError
} from '@sjsf/form';

import { JSON_CHUNKS_KEY, type InitialFormData, type ValidatedFormData } from '../model.js';

import type { Entry } from './entry.js';
import { parseSchemaValue } from './schema-value-parser.js';
import { makeFormDataEntriesConverter } from './convert-form-data-entries.js';

export type InitFormOptions<T, E, SendSchema extends boolean> = {
  sendSchema?: SendSchema;
  initialValue?: T;
  initialErrors?: ValidationError<E>[];
} & (SendSchema extends true
  ? { schema: Schema }
  : {
      schema?: never;
    });

export function initForm<T, E, SendSchema extends boolean = false>({
  schema,
  initialValue,
  initialErrors = [],
  sendSchema
}: InitFormOptions<T, E, SendSchema>): InitialFormData<T, E, SendSchema> {
  return {
    initialValue,
    initialErrors,
    schema: (sendSchema ? schema : undefined) as SendSchema extends true ? Schema : undefined
  };
}

export interface FormDataParserOptions {
  validator: Validator;
  merger?: Merger2;
  idPrefix?: string;
  idSeparator?: string;
  idPseudoSeparator?: string;
}

export function makeFormDataParser({
  validator,
  merger = defaultMerger,
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR
}: FormDataParserOptions) {
  return async ({
    request,
    schema,
    uiSchema = {}
  }: {
    schema: Schema;
    request: Request;
    uiSchema?: UiSchemaRoot;
  }): Promise<SchemaValue | undefined> => {
    const formData = await request.formData();
    if (formData.has(JSON_CHUNKS_KEY)) {
      const chunks = formData.getAll(JSON_CHUNKS_KEY).join('');
      return JSON.parse(chunks);
    }
    return parseSchemaValue({
      idPrefix,
      idSeparator,
      idPseudoSeparator,
      schema,
      uiSchema,
      entries: await Promise.all(
        formData
          .entries()
          .map((entry) =>
            entry[1] instanceof File
              ? fileToDataURL(request.signal, entry[1]).then(
                  (data): Entry<string> => [entry[0], data]
                )
              : (entry as Entry<Exclude<FormDataEntryValue, File>>)
          )
      ),
      validator,
      merger,
      convertEntries: makeFormDataEntriesConverter({
        validator,
        merger,
        rootSchema: schema,
        rootUiSchema: uiSchema
      })
    });
  };
}

export interface ValidateFormOptions<E, SendData extends boolean> {
  data: SchemaValue | undefined;
  schema: Schema;
  validator: FormValidator<E>;
  /** @default false */
  sendData?: SendData;
}

/** @deprecated use `validateForm2` instead */
export function validateForm<E, SendData extends boolean = false>({
  schema,
  validator,
  data,
  sendData
}: ValidateFormOptions<E, SendData>): ValidatedFormData<E, SendData> {
  const errors = validator.validateFormData(schema, data);
  return {
    isValid: errors.length === 0,
    sendData,
    data: (sendData ? data : undefined) as SendData extends true
      ? SchemaValue | undefined
      : undefined,
    errors
  };
}

export interface ValidateFormOptions2<E, SendData extends boolean> {
  request: Request
  data: SchemaValue | undefined;
  schema: Schema;
  validator: FormValidator2<E>;
  /** @default false */
  sendData?: SendData;
}

export async function validateForm2<E, SendData extends boolean = false>({
  request,
  schema,
  validator,
  data,
  sendData
}: ValidateFormOptions2<E, SendData>): Promise<ValidatedFormData<E, SendData>> {
  const errors = await validator.validateFormData(schema, data, request.signal);
  return {
    isValid: errors.length === 0,
    sendData,
    data: (sendData ? data : undefined) as SendData extends true
      ? SchemaValue | undefined
      : undefined,
    errors
  };
}