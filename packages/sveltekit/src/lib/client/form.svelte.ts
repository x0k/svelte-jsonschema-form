/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import type { Validator } from '@sjsf/form/core';
import {
  createForm,
  type Schema,
  type UiSchemaRoot,
  type FormOptions,
  groupErrors,
  type PossibleError
} from '@sjsf/form';

import { page } from '$app/state';

import type { InitialFormData, ValidatedFormData } from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';
import { createSvelteKitRequest, type SveltekitRequestOptions } from './request.svelte.js';

type SchemaOption<SendSchema> = SendSchema extends true
  ? {
      schema?: Schema;
      uiSchema?: UiSchemaRoot;
    }
  : {
      schema: Schema;
      uiSchema?: UiSchemaRoot;
    };

export type SvelteKitFormOptions<T, V extends Validator, SendSchema extends boolean> = Omit<
  FormOptions<T, V>,
  'schema'
> &
  SchemaOption<SendSchema>;
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
            uiSchema: page.data[meta.name].uiSchema, // I'm not sure if this does anything.
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

export type SvelteKitFormSetupOptions<Meta extends SvelteKitFormMeta<any, any, string, any>> = Omit<
  SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema']>,
  'onSubmit'
>;

export function setupSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  FormOptions extends Omit<
    SvelteKitFormOptions<Meta['__formValue'], Validator, Meta['__sendSchema']>,
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
