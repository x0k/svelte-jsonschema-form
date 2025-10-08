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
  isPrivate?: (path: FieldPath) => boolean;
}

export function createFormIdBuilder({
  schema: rootSchema,
  idPrefix,
  validator,
  merger,
  isPrivate = () => false
}: FormIdBuilderOptions): FormIdBuilder {
  const parts: string[] = [];
  return {
    fromPath: (path) => {
      parts.length = 0;
      if (isPrivate?.(path)) {
        parts.push('_');
      }
      let i = path.length - 1;
      let pseudo: FieldPseudoElement | undefined;
      while (i > 0 && (pseudo = decodePseudoElement(path[i])) !== undefined) {
        parts.push(typeof pseudo === 'string' ? encode(pseudo) : pseudo.toString(), '.');
        i--;
      }
      parts.push(encode(idPrefix));
      let currentSchema: SchemaDefinition | undefined = rootSchema;
      for (let j = 0; j <= i; j++) {
        const p = path[j]!;
        currentSchema = getSchemaDefinitionByPath(rootSchema, currentSchema, [p]);
        if (typeof p === 'string') {
          parts.push('.', encode(p));
        } else {
          parts.push('[', p.toString(), ']');
        }
      }
      if (
        pseudo === undefined &&
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
