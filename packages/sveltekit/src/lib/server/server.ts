import { fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MaybePromise } from '@sjsf/form/lib/types';
import type { Validator } from '@sjsf/form/core';
import {
  isFormValueValidator,
  type Schema,
  type UiSchemaRoot,
  type ValidationError,
  isAsyncFormValueValidator,
  type FormValue,
  type ValidatorFactoryOptions,
  type MergerFactoryOptions,
  type FormMerger,
  type UiOptionsRegistry,
  type Creatable,
  create,
  SJSF_ID_PREFIX
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
  type ValidatedFormData
} from '$lib/model.js';

import { parseSchemaValue } from './schema-value-parser.js';
import {
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from '../internal/convert-form-data-entry.js';

export interface FormHandlerOptions<SendData extends boolean> extends IdOptions {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  idIndexSeparator?: string;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
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

export function createFormHandler<SendData extends boolean>({
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
  createReviver = createDefaultReviver
}: FormHandlerOptions<SendData>) {
  const validator: Validator = create(createValidator, {
    schema,
    uiSchema,
    uiOptionsRegistry,
    merger: () => merger
  });
  const merger = create(createMerger, {
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
    convertUnknownEntry
  });
  return async (
    signal: AbortSignal,
    formData: FormData
  ): Promise<
    [
      ValidatedFormData<SendData>,
      FormValue,
      (errors: ValidationError[]) => ValidatedFormData<SendData>
    ]
  > => {
    const idPrefix = formData.get(SJSF_ID_PREFIX);
    if (typeof idPrefix !== 'string') {
      throw new Error(`"${SJSF_ID_PREFIX}" key is missing in FormData or not a string`);
    }
    const data = formData.has(JSON_CHUNKS_KEY)
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
    const errors = isAsyncFormValueValidator(validator)
      ? await validator.validateFormValueAsync(signal, schema, data)
      : isFormValueValidator(validator)
        ? validator.validateFormValue(schema, data)
        : [];
    function validated(errors: ValidationError[]) {
      return {
        idPrefix: idPrefix as string,
        isValid: errors.length === 0,
        sendData,
        data: (sendData ? data : undefined) as SendData extends true ? FormValue : undefined,
        errors
      } satisfies ValidatedFormData<SendData>;
    }
    return [validated(errors), data, validated];
  };
}

export function isValid<T>(vfd: ValidatedFormData<boolean>, data: unknown): data is T {
  return vfd.isValid;
}

type FormRecord<F extends string, SendData extends boolean> = {
  [K in F]: ValidatedFormData<SendData>;
};

interface FormMeta {
  idPrefix: string;
}

export function createAction<
  const F extends string,
  const SendData extends boolean,
  E extends RequestEvent,
  R extends Record<string, any> | void
>(
  options: FormHandlerOptions<SendData> & {
    name: F;
  },
  userAction: (
    data: any,
    event: E,
    meta: Readonly<FormMeta>
  ) => MaybePromise<ValidationError[] | R | void>
) {
  const handle = createFormHandler(options);
  return async (
    event: E
  ): Promise<(FormRecord<F, SendData> & R) | ActionFailure<FormRecord<F, SendData>>> => {
    const [form, data, validated] = await handle(
      event.request.signal,
      await event.request.formData()
    );
    if (!form.isValid) {
      return fail(400, { [options.name]: form } as FormRecord<F, SendData>);
    }
    let result = await userAction(data, event, form);
    if (Array.isArray(result)) {
      if (result.length > 0) {
        return fail(400, {
          [options.name]: validated(result)
        } as FormRecord<F, SendData>);
      } else {
        result = undefined;
      }
    }
    return { ...result, [options.name]: form } as FormRecord<F, SendData> & R;
  };
}
