import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import { getSchemaDefinitionByPath, isMultiSelect, type SchemaDefinition } from '@sjsf/form/core';
import {
  decodePseudoElement,
  type FieldPath,
  type FieldPseudoElement,
  type FormIdBuilder,
  type FormMerger,
  type Schema,
  type Validator
} from '@sjsf/form';

import { encode } from './codec.js';

export interface FormIdBuilderOptions {
  schema: Schema;
  validator: Validator;
  merger: FormMerger;
  idPrefix: string;
  pseudoSeparator?: string;
  isPrivate?: (path: FieldPath) => boolean;
}

export const DEFAULT_PSEUDO_SEPARATOR = '::';

export function createFormIdBuilder({
  schema: rootSchema,
  idPrefix,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
  validator,
  merger,
  isPrivate = () => false
}: FormIdBuilderOptions): FormIdBuilder {
  const parts: string[] = [];
  const encodedPseudoSeparator = encode(pseudoSeparator);
  return {
    fromPath: (path) => {
      parts.length = 0;
      if (isPrivate?.(path)) {
        parts.push('_');
      }
      parts.push(encode(idPrefix));
      let currentSchema: SchemaDefinition | undefined = rootSchema;
      let pseudo: FieldPseudoElement | undefined;
      let isPseudoUndefined = true;
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        pseudo = decodePseudoElement(p);
        isPseudoUndefined = pseudo === undefined;
        if (isPseudoUndefined) {
          currentSchema = getSchemaDefinitionByPath(rootSchema, currentSchema, [p]);
          if (typeof p === 'string') {
            parts.push('.', encode(p));
          } else {
            parts.push('[', p.toString(), ']');
          }
        } else {
          parts.push(encodedPseudoSeparator, encode(pseudo!.toString()));
        }
      }
      if (
        isPseudoUndefined &&
        currentSchema &&
        isSchemaObject(currentSchema) &&
        isMultiSelect(validator, merger, currentSchema, rootSchema)
      ) {
        parts.push('[]');
      }
      return parts.join('');
    }
  };
}
