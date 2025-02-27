/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import {
  createForm,
  type Schema,
  type FormOptions,
  groupErrors,
  type FormValidator
} from '@sjsf/form';

import { page } from '$app/state';

import type { InitialFormData, ValidatedFormData } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';

export type SvelteKitFormOptions<
  T,
  VE,
  V extends FormValidator<VE>,
  SendSchema extends boolean
> = Omit<FormOptions<T, VE, V>, 'schema'> &
  (SendSchema extends true
    ? {
        schema?: Schema;
      }
    : {
        schema: Schema;
      });

export function createSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  V extends FormValidator<Meta['__validationError']>,
  Options extends SvelteKitFormOptions<
    Meta['__formValue'],
    Meta['__validationError'],
    V,
    Meta['__sendSchema']
  >
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
  const defaults = initialFormData ?? {};
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
    }) as unknown as FormOptions<Meta['__formValue'], Meta['__validationError'], V>
  );
  $effect(() => {
    if (!isRecord(page.form)) {
      return;
    }
    const validationData = page.form[meta.name] as
      | ValidatedFormData<Meta["__validationError"], Meta['__sendData']>
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
