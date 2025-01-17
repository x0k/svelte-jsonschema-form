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
  groupErrors,
  type Config,
  type IdentifiableFieldElement
} from '@sjsf/form';

import { page } from '$app/state';

import {
  IDENTIFIABLE_FIELD_ELEMENTS,
  type InitialFormData,
  type ValidatedFormData
} from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';
import {
  isArrayOrObjectSchemaType,
  isPrimitiveSchemaType,
  isSchema,
  typeOfSchema
} from '@sjsf/form/core';
import { some } from '@sjsf/form/lib/array';

export type AdditionalPropertyKeyValidationError2 =
  | string
  | ((ctx: { key: string; separator: string; separators: string[] }) => string);

export type SvelteKitFormOptions2<V, E, SendSchema extends boolean> = Omit<
  FormOptions<V, E>,
  'schema'
> & {
  additionalPropertyKeyValidationError?: AdditionalPropertyKeyValidationError2;
  identifiableFieldElements?: (keyof IdentifiableFieldElement)[];
} & (SendSchema extends true
    ? {
        schema?: Schema;
      }
    : {
        schema: Schema;
      });

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
  const idSeparator = $derived(options.idSeparator ?? DEFAULT_ID_SEPARATOR);
  const separators = $derived([idSeparator]);
  const suffixes = $derived.by(() => {
    const pseudo = options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR;
    const elements = options.identifiableFieldElements ?? IDENTIFIABLE_FIELD_ELEMENTS;
    return elements.map((el) => `${pseudo}${el}`);
  });
  const additionalPropertyKeyValidationError = $derived(
    options.additionalPropertyKeyValidationError
  );
  const proto = {
    ...initialFormData,
    additionalPropertyKeyValidator:
      additionalPropertyKeyValidationError !== undefined
        ? {
            validateAdditionalPropertyKey(key: string, config: Config): string[] {
              const messages: string[] = [];
              const { additionalProperties } = config.schema;
              if (additionalProperties === undefined) {
                return messages;
              }
              const types = isSchema(additionalProperties)
                ? typeOfSchema(additionalProperties)
                : [];
              for (const separator of separators) {
                if (!key.includes(separator)) {
                  continue;
                }
                if (separator === idSeparator) {
                  if (!some(types, isArrayOrObjectSchemaType)) {
                    continue;
                  }
                }
                messages.push(
                  typeof additionalPropertyKeyValidationError === 'string'
                    ? additionalPropertyKeyValidationError
                    : additionalPropertyKeyValidationError({ key, separator, separators })
                );
              }
              for (const suffix of suffixes) {
                if (!key.endsWith(suffix) || !some(types, isPrimitiveSchemaType)) {
                  continue;
                }
                messages.push(
                  typeof additionalPropertyKeyValidationError === 'string'
                    ? additionalPropertyKeyValidationError
                    : additionalPropertyKeyValidationError({
                        key,
                        separator: suffix,
                        separators: suffixes
                      })
                );
              }
              return messages;
            }
          }
        : undefined
  };
  const form = createForm3<FormOptions<Meta['__formValue'], E>>(
    Object.setPrototypeOf(options, proto)
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
