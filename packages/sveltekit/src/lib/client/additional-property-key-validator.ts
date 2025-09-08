import { some } from '@sjsf/form/lib/array';
import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import {
  isArrayOrObjectSchemaType,
  isPrimitiveSchemaType,
  typeOfSchema
} from '@sjsf/form/core';
import {
  DEFAULT_ID_SEPARATOR,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  type IdentifiableFieldElement,
  type Schema,
  type AdditionalPropertyKeyValidator
} from '@sjsf/form';

import { IDENTIFIABLE_INPUT_ELEMENTS } from '../model.js';

export enum AdditionalPropertyKeyValidationErrorType {
  ForbiddenSequence = 'forbidden-sequence',
  ForbiddenSuffix = 'forbidden-suffix'
}

export interface ErrorFactoryOptions {
  key: string;
  type: AdditionalPropertyKeyValidationErrorType;
  value: string;
  values: string[];
}

export interface AdditionalPropertyKeyValidatorOptions {
  idSeparator?: string;
  idPseudoSeparator?: string;
  identifiableFieldElements?: (keyof IdentifiableFieldElement)[];
  error: string | ((ctx: ErrorFactoryOptions) => string);
}

export function createAdditionalPropertyKeyValidator({
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
  identifiableFieldElements = IDENTIFIABLE_INPUT_ELEMENTS,
  error
}: AdditionalPropertyKeyValidatorOptions): AdditionalPropertyKeyValidator {
  const separators = [idSeparator];
  const suffixes = identifiableFieldElements.map((el) => `${idPseudoSeparator}${el}`);
  return {
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
          typeof error === 'string'
            ? error
            : error({
                type,
                key,
                value,
                values
              })
        );
      // TODO: handle `$ref` in `additionalProperties`
      const types = isSchemaObject(additionalProperties) ? typeOfSchema(additionalProperties) : [];
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
        pushMessage(AdditionalPropertyKeyValidationErrorType.ForbiddenSuffix, suffix, suffixes);
      }
      return messages;
    }
  };
}
