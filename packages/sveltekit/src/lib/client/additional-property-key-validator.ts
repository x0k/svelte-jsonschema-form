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
  type IdentifiableFieldElement,
  type Schema,
  type SyncAdditionalPropertyKeyValidator
} from '@sjsf/form';

import { IDENTIFIABLE_FIELD_ELEMENTS } from '../model.js';

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

export interface SyncAdditionalPropertyKeyValidatorOptions {
  idSeparator?: string;
  idPseudoSeparator?: string;
  identifiableFieldElements?: (keyof IdentifiableFieldElement)[];
  error: string | ((ctx: ErrorFactoryOptions) => string);
}

export function createSyncAdditionalPropertyKeyValidator({
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR,
  identifiableFieldElements = IDENTIFIABLE_FIELD_ELEMENTS,
  error
}: SyncAdditionalPropertyKeyValidatorOptions): SyncAdditionalPropertyKeyValidator {
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
      const types = isSchema(additionalProperties) ? typeOfSchema(additionalProperties) : [];
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
