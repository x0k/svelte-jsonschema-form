/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import {
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  createForm3,
  type AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type Schema,
  type FormOptions,
  groupErrors
} from '@sjsf/form';

import { page } from '$app/state';

import type { InitialFormData, ValidatedFormData } from '../model';

import type { SvelteKitFormMeta } from './meta';

export type AdditionalPropertyKeyValidationError2 =
  | string
  | ((ctx: { key: string; separator: string; separators: string[] }) => string);

export type SvelteKitFormOptions2<V, E, SendSchema extends boolean> = Omit<
  FormOptions<V, E>,
  'schema'
> & {
  additionalPropertyKeyValidationError?: AdditionalPropertyKeyValidationError2;
} & (SendSchema extends true
    ? {
        schema?: Schema;
      }
    : { schema: Schema });

export function createSvelteKitForm<
  Meta extends SvelteKitFormMeta<any, any, string, any>,
  Options extends SvelteKitFormOptions2<Meta['__formValue'], E, Meta['__sendData']>,
  E = Options extends
    | { additionalPropertyKeyValidationError: AdditionalPropertyKeyValidationError2 }
    | { additionalPropertyKeyValidator: AdditionalPropertyKeyValidator }
    ? Meta['__validationError'] | AdditionalPropertyKeyError
    : Meta['__validationError']
>(meta: Meta, options: Options) {
  const initialFormData: InitialFormData<Meta['__formValue'], E, Meta['__sendSchema']> | undefined =
    $derived.by(() => {
      if (isRecord(page.form)) {
        const validationData = page.form[meta.name] as
          | ValidatedFormData<E, Meta['__sendData']>
          | undefined;
        if (validationData !== undefined) {
          return {
            schema: options.schema ?? page.data[meta.name].schema,
            initialValue: validationData.data,
            initialErrors: validationData.errors
          };
        }
      } else {
        return page.data[meta.name];
      }
    });
  const separators = [
    options.idSeparator ?? DEFAULT_ID_SEPARATOR,
    options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR
  ];
  const additionalPropertyKeyValidationError = $derived(
    options.additionalPropertyKeyValidationError
  );
  const form = createForm3<FormOptions<Meta['__formValue'], E>>(
    Object.setPrototypeOf(options, {
      ...initialFormData,
      additionalPropertyKeyValidator:
        additionalPropertyKeyValidationError !== undefined
          ? {
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
          : undefined
    })
  );
  $effect(() => {
    if (!isRecord(page.form)) {
      return;
    }
    const validationData = page.form[meta.name] as
      | ValidatedFormData<E, Meta['__sendData']>
      | undefined;
    if (validationData === undefined) {
      return;
    }
    if (validationData.sendData) {
      form.formValue = validationData.data;
    }
    form.errors = groupErrors(validationData.errors);
  });
  return form;
}
