import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import { getSchemaDefinitionByPath, isMultiSelect, type SchemaDefinition } from '@sjsf/form/core';
import {
  decodePseudoElement,
  type FieldPseudoElement,
  type FormIdBuilder,
  type FormMerger,
  type Schema,
  type Validator
} from '@sjsf/form';

import { encode } from './codec.js';

export interface FormIdBuilderOptions {
  schema: Schema;
  idPrefix: string;
  pseudoSeparator?: string;
  validator: () => Validator;
  merger: () => FormMerger;
}

export const DEFAULT_PSEUDO_SEPARATOR = '::';

export function createFormIdBuilder({
  idPrefix,
  schema: rootSchema,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
  validator,
  merger
}: FormIdBuilderOptions): FormIdBuilder {
  return {
    fromPath: (path) => {
      let str = '';
      let currentSchema: SchemaDefinition | undefined = rootSchema;
      let pseudo: FieldPseudoElement | undefined;
      let isPseudoUndefined = true;
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        pseudo = decodePseudoElement(p);
        isPseudoUndefined = pseudo === undefined;
        if (isPseudoUndefined) {
          currentSchema = getSchemaDefinitionByPath(rootSchema, currentSchema, [p]);
          str += typeof p === 'string' ? '.' + encode(p) : `[${p}]`;
        } else {
          str += encode(`${pseudoSeparator}${pseudo}`);
        }
      }
      if (
        isPseudoUndefined &&
        currentSchema &&
        isSchemaObject(currentSchema) &&
        isMultiSelect(validator(), merger(), currentSchema, rootSchema)
      ) {
        str += '[]';
      }
      return `${encode(idPrefix)}${str}`;
    }
  };
}
