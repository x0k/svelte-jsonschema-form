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
  SJSF_ID_PREFIX,
  type ValidationResult
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

export interface FormHandlerOptions extends IdOptions {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  idIndexSeparator?: string;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
  /** @default false */
  sendData?: boolean | 'withoutClientSideUpdate';
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

export function createFormHandler<T = FormValue>({
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
  sendData = false,
  createReviver = createDefaultReviver
}: FormHandlerOptions) {
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
  ): Promise<[ValidatedFormData, FormValue, (errors: ValidationError[]) => ValidatedFormData]> => {
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
    const result: ValidationResult<T> = isAsyncFormValueValidator<typeof validator, T>(validator)
      ? await validator.validateFormValueAsync(signal, schema, data)
      : isFormValueValidator<typeof validator, T>(validator)
        ? validator.validateFormValue(schema, data)
        : { value: data };
    function validated(errors: ReadonlyArray<ValidationError>) {
      const isValid = errors.length === 0
      return {
        idPrefix: idPrefix as string,
        isValid,
        data: sendData ? data : undefined,
        updateData: !isValid && (sendData === 'withoutClientSideUpdate' ? false : sendData),
        errors
      } satisfies ValidatedFormData;
    }
    // TODO: Use `T` in `ValidatedFormData` type
    return [validated(result.errors ?? []), data, validated];
  };
}

export function isValid<T>(vfd: ValidatedFormData, data: unknown): data is T {
  return vfd.isValid;
}

type FormRecord<F extends string> = {
  [K in F]: ValidatedFormData;
};

interface FormMeta {
  idPrefix: string;
}

export function createAction<
  const F extends string,
  E extends RequestEvent,
  R extends Record<string, any> | void
>(
  options: FormHandlerOptions & {
    name: F;
  },
  userAction: (
    data: any,
    event: E,
    meta: Readonly<FormMeta>
  ) => MaybePromise<ValidationError[] | R | void>
) {
  const handle = createFormHandler(options);
  return async (event: E): Promise<(FormRecord<F> & R) | ActionFailure<FormRecord<F>>> => {
    const [form, data, validated] = await handle(
      event.request.signal,
      await event.request.formData()
    );
    if (!form.isValid) {
      return fail(400, { [options.name]: form } as FormRecord<F>);
    }
    let result = await userAction(data, event, form);
    if (Array.isArray(result)) {
      if (result.length > 0) {
        return fail(400, {
          [options.name]: validated(result)
        } as FormRecord<F>);
      } else {
        result = undefined;
      }
    }
    return { ...result, [options.name]: form } as FormRecord<F> & R;
  };
}
