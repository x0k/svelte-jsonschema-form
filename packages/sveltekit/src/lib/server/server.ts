/* eslint-disable @typescript-eslint/no-explicit-any */
import { fileToDataURL } from '@sjsf/form/lib/file';
import { defaultMerger, type Merger, type Validator } from '@sjsf/form/core';
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  isFormValueValidator,
  type FormValueValidator,
  type Schema,
  type SchemaValue,
  type UiSchemaRoot,
  type ValidationError,
  type IdOptions,
  type AsyncFormValueValidator,
  type AnyFormValueValidatorError,
  type AnyFormValueValidator,
  isAsyncFormValueValidator
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

export interface FormDataParserOptions extends IdOptions {
  validator: Validator;
  merger?: Merger;
}

export function makeFormDataParser({
  validator,
  merger = defaultMerger,
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR
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

export interface ValidateFormOptions<
  V extends FormValueValidator<any> | AsyncFormValueValidator<any>,
  SendData extends boolean
> {
  request: Request;
  data: SchemaValue | undefined;
  schema: Schema;
  validator: V;
  /** @default false */
  sendData?: SendData;
}

export async function validateForm<
  V extends AnyFormValueValidator<any>,
  SendData extends boolean = false
>({
  request,
  schema,
  validator,
  data,
  sendData
}: ValidateFormOptions<V, SendData>): Promise<
  ValidatedFormData<AnyFormValueValidatorError<V>, SendData>
> {
  const errors = isFormValueValidator(validator)
    ? validator.validateFormValue(schema, data)
    : isAsyncFormValueValidator(validator)
      ? await validator.validateFormValueAsync(request.signal, schema, data)
      : [];
  return {
    isValid: errors.length === 0,
    sendData,
    data: (sendData ? data : undefined) as SendData extends true
      ? SchemaValue | undefined
      : undefined,
    errors
  };
}
