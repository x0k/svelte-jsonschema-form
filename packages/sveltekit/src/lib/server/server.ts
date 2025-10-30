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
  type InvalidFormData,
  type SendData,
  type ValidatedFormData,
  type ValidFormData
} from '$lib/model.js';

import { parseSchemaValue } from './schema-value-parser.js';
import {
  createFormDataEntryConverter,
  type FormDataConverterOptions,
  type UnknownEntryConverter
} from '../internal/convert-form-data-entry.js';

export interface FormHandlerOptions<I, O, SD extends SendData> extends IdOptions {
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  uiOptionsRegistry?: UiOptionsRegistry;
  idIndexSeparator?: string;
  validator: Creatable<FormValidator<I, O>, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  createEntryConverter?: Creatable<EntryConverter<FormDataEntryValue>, FormDataConverterOptions>;
  convertUnknownEntry?: UnknownEntryConverter;
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

export function createFormHandler<I, O = I, SD extends SendData = false>({
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
}: FormHandlerOptions<I, O, SD>) {
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
    convertUnknownEntry
  });
  return async (
    signal: AbortSignal,
    formData: FormData
  ): Promise<
    [
      ValidatedFormData<O, SD>,
      O | FormValue,
      (errors: ValidationError[]) => ValidatedFormData<O, SD>
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
    const result: ValidationResult<O> =
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
            } as ValidFormData<O, SD>)
          : ({
              isValid,
              data: sendData ? data : undefined
            } as InvalidFormData<SD>))
      } satisfies ValidatedFormData<O, SD>;
    }
    return [validated(result.errors ?? []), result.value, validated];
  };
}

export function isValid<Out, SD extends SendData>(
  vfd: ValidatedFormData<Out, SD>,
  data: unknown
): data is Out {
  return vfd.isValid;
}

type FormRecord<F extends string, Out, SD extends SendData> = {
  [K in F]: ValidatedFormData<Out, SD>;
};

interface FormMeta {
  idPrefix: string;
}

export function createAction<
  O,
  SD extends SendData,
  const F extends string,
  E extends RequestEvent,
  R extends Record<string, any> | void
>(
  options: FormHandlerOptions<any, O, SD> & {
    name: F;
  },
  userAction: (
    data: O,
    event: E,
    meta: Readonly<FormMeta>
  ) => MaybePromise<ValidationError[] | R | void>
) {
  const handle = createFormHandler(options);
  return async (
    event: E
  ): Promise<(FormRecord<F, O, SD> & R) | ActionFailure<FormRecord<F, O, SD>>> => {
    const [form, data, validated] = await handle(
      event.request.signal,
      await event.request.formData()
    );
    if (!form.isValid) {
      return fail(400, { [options.name]: form } as FormRecord<F, O, SD>);
    }
    let result = await userAction(data as O, event, form);
    if (Array.isArray(result)) {
      if (result.length > 0) {
        return fail(400, {
          [options.name]: validated(result)
        } as FormRecord<F, O, SD>);
      } else {
        result = undefined;
      }
    }
    return { ...result, [options.name]: form } as FormRecord<F, O, SD> & R;
  };
}
