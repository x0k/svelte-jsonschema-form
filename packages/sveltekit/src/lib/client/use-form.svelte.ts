/* eslint-disable @typescript-eslint/no-explicit-any */
import { onDestroy } from 'svelte';
import type { AnyKey } from '@sjsf/form/lib/types';
import { isRecord } from '@sjsf/form/lib/object';
import {
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  groupErrors,
  createForm3,
  setFromContext,
  type AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type Schema,
  type SchemaValue,
  type FormOptions
} from '@sjsf/form';

import { page } from '$app/stores';

import type { InitialFormData, ValidatedFormData } from '../model';

import { useSvelteKitMutation, type SveltekitMutationOptions } from './use-mutation.svelte';

export type ValidatedFormDataFromActionDataBranch<ActionData, FormName extends keyof ActionData> =
  ActionData[FormName] extends ValidatedFormData<any, any> ? ActionData[FormName] : never;

export type ValidatedFormDataFromActionDataUnion<
  ActionData,
  FormName extends keyof ActionData
> = ActionData extends any ? ValidatedFormDataFromActionDataBranch<ActionData, FormName> : never;

export type FormNameFromActionDataBranch<ActionData> = keyof {
  [K in keyof ActionData]: ActionData[K] extends ValidatedFormData<any, any> ? K : never;
};

export type FormNameFromActionDataUnion<ActionData> = ActionData extends any
  ? FormNameFromActionDataBranch<ActionData>
  : never;

export type ValidatorErrorFromValidatedFormData<VFD> =
  VFD extends ValidatedFormData<infer E, any> ? E : never;

export type InitialFromDataFromPageData<PageData, FormName extends AnyKey> =
  PageData[keyof PageData & FormName] extends InitialFormData<any, any, any>
    ? PageData[keyof PageData & FormName]
    : InitialFormData<never, never, false>;

export type FormValueFromInitialFormData<IFD, E, FallbackValue> =
  IFD extends InitialFormData<infer T, E, any>
    ? unknown extends T
      ? FallbackValue
      : T
    : FallbackValue;

export type SendDataFromValidatedFormData<VFD, E> =
  VFD extends ValidatedFormData<E, infer SendData> ? SendData : false;

export type SendSchemaFromInitialFormData<IFD, V, E> =
  IFD extends InitialFormData<V, E, infer SendSchema> ? SendSchema : false;

type SvelteKitFormMeta<ActionData, PageData, FallbackValue = SchemaValue> = {
  __actionData: ActionData;
  __pageData: PageData;
  __fallbackValue: FallbackValue;
};

export function meta<ActionData, PageData, FallbackValue = SchemaValue>(): SvelteKitFormMeta<
  ActionData,
  PageData,
  FallbackValue
> {
  return null as unknown as SvelteKitFormMeta<ActionData, PageData, FallbackValue>;
}

export type AdditionalPropertyKeyValidationError =
  | string
  | ((ctx: { key: string; separator: string; separators: string[] }) => string);

export type SvelteKitFormOptions<ActionData, V, E, SendSchema extends boolean> = Omit<
  FormOptions<V, E>,
  'onSubmit' | 'schema'
> &
  SveltekitMutationOptions<ActionData, V> & {
    additionalPropertyKeyValidationError?: AdditionalPropertyKeyValidationError;
  } & (SendSchema extends true
    ? {
        schema?: Schema;
      }
    : { schema: Schema });

/** @deprecated use `createSvelteKitForm` instead */
export function useSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any>,
  N extends FormNameFromActionDataUnion<Meta['__actionData']>,
  Options extends SvelteKitFormOptions<
    Meta['__actionData'],
    V,
    E,
    SendDataFromValidatedFormData<VFD, E>
  >,
  VFD = ValidatedFormDataFromActionDataUnion<Meta['__actionData'], N>,
  IFD = InitialFromDataFromPageData<Meta['__pageData'], N>,
  VE = ValidatorErrorFromValidatedFormData<VFD>,
  V = FormValueFromInitialFormData<IFD, VE, Meta['__fallbackValue']>,
  E = Options extends
    | { additionalPropertyKeyValidationError: AdditionalPropertyKeyValidationError }
    | { additionalPropertyKeyValidator: AdditionalPropertyKeyValidator }
    ? VE | AdditionalPropertyKeyError
    : VE,
  SendSchema extends boolean = SendSchemaFromInitialFormData<IFD, V, E>,
  SendData extends boolean = SendDataFromValidatedFormData<VFD, E>
>(__do_not_use: Meta, name: N, options: Options) {
  let lastInitialFormData: InitialFormData<V, E, SendSchema> | undefined;
  let initialized = false;
  const unsubscribe = page.subscribe((page) => {
    if (isRecord(page.form)) {
      const validationData = page.form[name] as ValidatedFormData<E, SendData> | undefined;
      if (validationData !== undefined) {
        if (initialized) {
          if (validationData.sendData) {
            form.formValue = validationData.data;
          }
          form.errors = groupErrors(validationData.errors);
        } else {
          initialized = true;
          lastInitialFormData = {
            schema: options.schema ?? page.data[name as string].schema,
            initialValue: validationData.data as V,
            initialErrors: validationData.errors
          };
        }
        return;
      }
    }
    if (!initialized) {
      initialized = true;
      lastInitialFormData = page.data[name as string];
      return;
    }
  });
  onDestroy(unsubscribe);

  const request = useSvelteKitMutation<Meta['__actionData'], V>(options);

  const separators = [
    options.idSeparator ?? DEFAULT_ID_SEPARATOR,
    options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR
  ];
  const additionalPropertyKeyValidationError = $derived(
    options.additionalPropertyKeyValidationError
  );
  const form = createForm3<FormOptions<V, E>>(
    Object.setPrototypeOf(options, {
      ...lastInitialFormData,
      onSubmit: request.run,
      additionalPropertyKeyValidator: additionalPropertyKeyValidationError && {
        validateAdditionalPropertyKey(key: string): string[] {
          for (const separator of separators) {
            if (key.includes(separator)) {
              return [
                typeof additionalPropertyKeyValidationError === 'string'
                  ? additionalPropertyKeyValidationError
                  : additionalPropertyKeyValidationError({ key, separator, separators })
              ];
            }
          }
          return [];
        }
      }
    })
  );
  setFromContext(form.context);

  return {
    form,
    mutation: request,
    enhance: form.enhance.bind(form)
  };
}
