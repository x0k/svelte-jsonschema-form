/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import { createForm, groupErrors, type Schema, type FormOptions } from '@sjsf/form';

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
  SendSchema extends boolean,
  ToOmit extends keyof FormOptions<T> = never
> = Omit<FormOptions<T>, 'schema' | ToOmit> & SchemaOption<SendSchema>;

function initialFormData<Meta extends SvelteKitFormMeta<any, any, string, any>>(
  meta: Meta
): InitialFormData<Meta['__formValue'], Meta['__sendSchema']> | undefined {
  if (isRecord(page.form)) {
    const validationData = page.form[meta.name] as
      | ValidatedFormData<Meta['__sendData']>
      | undefined;
    if (validationData !== undefined) {
      return validationData.isValid
        ? page.data[meta.name]
        : {
            ...page.data[meta.name],
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
  Options extends SvelteKitFormOptions<Meta['__formValue'], Meta['__sendSchema']>
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
    }) as unknown as FormOptions<Meta['__formValue']>
  );
  $effect(() => {
    if (!isRecord(page.form)) {
      return;
    }
    const validationData = page.form[meta.name] as
      | ValidatedFormData<Meta['__sendData']>
      | undefined;
    if (validationData === undefined) {
      return;
    }
    if (validationData.sendData && form.isSubmitted) {
      form.value = validationData.data;
    }
    form.errors = groupErrors(form, validationData.errors);
  });
  return form;
}

export type SvelteKitFormSetupOptions<Meta extends SvelteKitFormMeta<any, any, string, any>> =
  SvelteKitFormOptions<Meta['__formValue'], Meta['__sendSchema'], 'onSubmit'> &
    SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']>;

export function setupSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  FormOptions extends SvelteKitFormSetupOptions<Meta>
>(
  meta: Meta,
  formOptions: FormOptions,
  requestOptions: SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']> = formOptions
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
