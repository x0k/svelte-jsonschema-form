/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import {
  createForm,
  type Schema,
  type FormOptions,
  updateErrors,
  DEFAULT_ID_PREFIX,
  setValue
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
  SendSchema extends boolean,
  ToOmit extends keyof FormOptions<T> = never
> = Omit<FormOptions<T>, 'schema' | ToOmit> & SchemaOption<SendSchema>;

function initialFormData<Meta extends SvelteKitFormMeta<any, any, string, any>>(
  meta: Meta,
  idPrefix: string
): InitialFormData<Meta['__formValue']> | undefined {
  if (isRecord(page.form)) {
    const validationData = page.form[meta.name] as
      | ValidatedFormData<Meta['__formValue'], Meta['__sendData']>
      | undefined;
    if (
      validationData !== undefined &&
      validationData.idPrefix === idPrefix &&
      !validationData.isValid
    ) {
      return {
        ...page.data[meta.name],
        initialValue: validationData.data,
        initialErrors: validationData.errors
      };
    }
  }
  return page.data[meta.name];
}

export function createSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  Options extends SvelteKitFormOptions<Meta['__formValue'], Meta['__sendSchema']>
>(meta: Meta, options: Options) {
  const formIdPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const defaults = initialFormData(meta, formIdPrefix) ?? {};
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
      | ValidatedFormData<Meta['__formValue'], Meta['__sendData']>
      | undefined;
    if (validationData === undefined || formIdPrefix !== validationData.idPrefix) {
      return;
    }
    if (validationData.updateData) {
      setValue(form, validationData.data as Meta['__formValue']);
    }
    updateErrors(form, validationData.errors);
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
