/* eslint-disable @typescript-eslint/no-explicit-any */
import { isRecord } from '@sjsf/form/lib/object';
import { some } from '@sjsf/form/lib/array';
import {
  isArrayOrObjectSchemaType,
  isPrimitiveSchemaType,
  isSchema,
  typeOfSchema
} from '@sjsf/form/core';
import {
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  createForm3,
  type AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type Schema,
  type FormOptions,
  groupErrors,
  type IdentifiableFieldElement
} from '@sjsf/form';

import { page } from '$app/state';

import {
  IDENTIFIABLE_FIELD_ELEMENTS,
  type InitialFormData,
  type ValidatedFormData
} from '../model.js';

import type { SvelteKitFormMeta } from './meta.js';

export enum AdditionalPropertyKeyValidationErrorType {
  ForbiddenSequence = 'forbidden-sequence',
  ForbiddenSuffix = 'forbidden-suffix'
}

export interface AdditionalPropertyKeyValidationErrorFnOptions {
  key: string;
  type: AdditionalPropertyKeyValidationErrorType;
  /** @deprecated */
  separator: string;
  /** @deprecated */
  separators: string[];
  value: string;
  values: string[];
}

export type AdditionalPropertyKeyValidationError2 =
  | string
  | ((ctx: AdditionalPropertyKeyValidationErrorFnOptions) => string);

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
            validateAdditionalPropertyKey(key: string, { additionalProperties }: Schema): string[] {
              const messages: string[] = [];
              if (additionalProperties === undefined) {
                return messages;
              }
              const pushMessage = (
                type: AdditionalPropertyKeyValidationErrorType,
                value: string,
                values: string[]
              ) =>
                messages.push(
                  typeof additionalPropertyKeyValidationError === 'string'
                    ? additionalPropertyKeyValidationError
                    : additionalPropertyKeyValidationError({
                        type,
                        key,
                        value,
                        values,
                        separator: value,
                        separators: values
                      })
                );
              // TODO: handle `$ref` in `additionalProperties`
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
                pushMessage(
                  AdditionalPropertyKeyValidationErrorType.ForbiddenSequence,
                  separator,
                  separators
                );
              }
              for (const suffix of suffixes) {
                if (!key.endsWith(suffix) || !some(types, isPrimitiveSchemaType)) {
                  continue;
                }
                pushMessage(
                  AdditionalPropertyKeyValidationErrorType.ForbiddenSuffix,
                  suffix,
                  suffixes
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
