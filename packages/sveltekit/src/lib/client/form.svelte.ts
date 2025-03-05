/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import {
  createForm,
  type Schema,
  type FormOptions,
  groupErrors,
  type PossibleError
} from '@sjsf/form';

import { page } from '$app/state';

import type { InitialFormData, ValidatedFormData } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';
import { createSvelteKitRequest, type SveltekitRequestOptions } from './request.svelte.js';
import type { Validator } from '@sjsf/form/core';

export type SvelteKitFormOptions<T, V extends Validator, SendSchema extends boolean> = Omit<
  FormOptions<T, V>,
  'schema'
> &
  (SendSchema extends true
    ? {
        schema?: Schema;
      }
    : {
        schema: Schema;
      });

export function createSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  Options extends SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema']>
>(meta: Meta, options: Options) {
  const initialFormData:
    | InitialFormData<Meta['__formValue'], Meta['__validationError'], Meta['__sendSchema']>
    | undefined = $derived.by(() => {
    if (isRecord(page.form)) {
      const validationData = page.form[meta.name] as
        | ValidatedFormData<Meta['__validationError'], Meta['__sendData']>
        | undefined;
      if (validationData !== undefined) {
        return validationData.isValid
          ? page.data[meta.name]
          : {
              schema: options.schema ?? page.data[meta.name].schema,
              initialValue: validationData.data,
              initialErrors: validationData.errors
            };
      }
    } else {
      return page.data[meta.name];
    }
  });
  const defaults = $derived(initialFormData ?? {});
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
    }) as unknown as FormOptions<Meta['__formValue'], Options['validator']>
  );
  $effect(() => {
    if (!isRecord(page.form)) {
      return;
    }
    const validationData = page.form[meta.name] as
      | ValidatedFormData<PossibleError<Options['validator']>, Meta['__sendData']>
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
  SveltekitRequestOptions<Meta['__actionData'], Meta['__formValue']> &
    Omit<SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema']>, 'onSubmit'>;

export function setupSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  Options extends SvelteKitFormSetupOptions<Meta>
>(meta: Meta, options: Options) {
  const request = createSvelteKitRequest(meta, options);
  const form = createSvelteKitForm(
    meta,
    // @ts-expect-error
    new Proxy(props, {
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
    }) as SvelteKitFormOptions<Meta['__formValue'], Options['validator'], Meta['__sendSchema']>
  );
  return { request, form };
}
