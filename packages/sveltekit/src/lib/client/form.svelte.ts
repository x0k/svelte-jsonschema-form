/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import type { Validator } from '@sjsf/form/core';
import {
  createForm,
  groupErrors,
  type Schema,
  type FormOptions,
  type PossibleError,
  type ValidatorFactoryOptions,
  type CommonFormOptions,
  type MergerFormOptions,
  type ValidatorFormOptions,
  type UiOptionsRegistryOption
} from '@sjsf/form';

import { page } from '$app/state';

import type { InitialFormData, ValidatedFormData } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';
import { createSvelteKitRequest, type SveltekitRequestOptions } from './request.svelte.js';

type SchemaOption<SendSchema> = SendSchema extends true
  ? {
      schema?: Schema;
    }
  : {
      schema: Schema;
    };

export type SvelteKitFormOptions<
  T,
  V extends Validator,
  SendSchema extends boolean,
  ToOmit extends keyof CommonFormOptions<T, V> = never
> = Omit<CommonFormOptions<T, V>, 'schema' | ToOmit> &
  ValidatorFormOptions<V> &
  MergerFormOptions<V> &
  SchemaOption<SendSchema> &
  UiOptionsRegistryOption;

type ValidatorType<O> = O extends { validator: infer V }
  ? V
  : O extends { createValidator: (options: ValidatorFactoryOptions) => infer V }
    ? V
    : Validator;

function initialFormData<Meta extends SvelteKitFormMeta<any, any, string, any>>(
  meta: Meta
):
  | InitialFormData<Meta['__formValue'], Meta['__validationError'], Meta['__sendSchema']>
  | undefined {
  if (isRecord(page.form)) {
    const validationData = page.form[meta.name] as
      | ValidatedFormData<Meta['__validationError'], Meta['__sendData']>
      | undefined;
    if (validationData !== undefined) {
      return validationData.isValid
        ? page.data[meta.name]
        : {
            schema: page.data[meta.name].schema,
            initialValue: validationData.data,
            initialErrors: validationData.errors
          };
    }
  } else {
    return page.data[meta.name];
  }
}

export function createSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  Options extends SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema']>
>(meta: Meta, options: Options) {
  const defaults = initialFormData(meta) ?? {};
  const form = createForm(
    new Proxy(options, {
      has(target, p) {
        return Reflect.has(target, p) || p in defaults;
      },
      get(target, p, receiver) {
        if (!(p in target)) {
          return defaults[p as keyof typeof defaults];
        }
        return Reflect.get(target, p, receiver);
      }
    }) as unknown as FormOptions<Meta['__formValue'], ValidatorType<Options>>
  );
  $effect(() => {
    if (!isRecord(page.form)) {
      return;
    }
    const validationData = page.form[meta.name] as
      | ValidatedFormData<PossibleError<ValidatorType<Options>>, Meta['__sendData']>
      | undefined;
    if (validationData === undefined) {
      return;
    }
    if (validationData.sendData && form.isSubmitted) {
      form.value = validationData.data;
    }
    form.errors = groupErrors(validationData.errors);
  });
  return form;
}

export type SvelteKitFormSetupOptions<Meta extends SvelteKitFormMeta<any, any, string, any>> =
  SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema'], 'onSubmit'>;

export function setupSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  FormOptions extends SvelteKitFormOptions<
    Meta['__formValue'],
    Validator,
    Meta['__sendSchema'],
    'onSubmit'
  >
>(
  meta: Meta,
  formOptions: FormOptions,
  requestOptions: SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']> = {}
) {
  const request = createSvelteKitRequest(meta, requestOptions);
  const form = createSvelteKitForm(
    meta,
    new Proxy(formOptions, {
      has(target, p) {
        if (p === 'onSubmit') {
          return true;
        }
        return Reflect.has(target, p);
      },
      get(target, p, receiver) {
        if (p === 'onSubmit') {
          return request.run;
        }
        return Reflect.get(target, p, receiver);
      }
    }) as FormOptions & SchemaOption<Meta['__sendSchema']>
  );
  return { request, form };
}
