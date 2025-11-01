import type { Ref } from '@sjsf/form/lib/svelte.svelte';
import { isSchemaObject } from '@sjsf/form/lib/json-schema';
import {
  getSchemaDefinitionByPath,
  isMultiSelect,
  isSchemaObjectValue,
  type SchemaDefinition
} from '@sjsf/form/core';
import {
  decodePseudoElement,
  type FieldPath,
  type FieldPseudoElement,
  type FormIdBuilder,
  type FormMerger,
  type FormValue,
  type Schema,
  type Validator
} from '@sjsf/form';

import { encode } from './internal/codec.js';

export interface FormIdBuilderOptions {
  schema: Schema;
  validator: Validator;
  merger: FormMerger;
  idPrefix: string;
  pseudoPrefix?: string;
  valueRef: Ref<FormValue>;
  isPrivate?: (path: FieldPath) => boolean;
}

export const DEFAULT_PSEUDO_PREFIX = '::';

export function createFormIdBuilder({
  schema: rootSchema,
  idPrefix,
  validator,
  merger,
  valueRef,
  pseudoPrefix = DEFAULT_PSEUDO_PREFIX,
  isPrivate = () => false
}: FormIdBuilderOptions): FormIdBuilder {
  const parts: string[] = [];
  const encodedIdPrefix = encode(idPrefix);
  const encodedPseudoPrefix = encode(pseudoPrefix);
  return {
    fromPath: (path) => {
      parts.length = 0;
      if (isPrivate?.(path)) {
        parts.push('_');
      }
      let i = path.length - 1;
      let pseudo: FieldPseudoElement | undefined;
      while (i >= 0 && (pseudo = decodePseudoElement(path[i])) !== undefined) {
        parts.push(
          encodedPseudoPrefix,
          typeof pseudo === 'string' ? encode(pseudo) : pseudo.toString(),
          '.'
        );
        i--;
      }
      parts.push(encodedIdPrefix);
      let currentSchema: SchemaDefinition | undefined = rootSchema;
      let currentValue = valueRef.current;
      for (let j = 0; j <= i; j++) {
        const p = path[j]!;
        currentSchema = getSchemaDefinitionByPath(
          validator,
          merger,
          rootSchema,
          currentSchema,
          [p],
          currentValue
        );
        if (typeof p === 'string') {
          parts.push('.', encode(p));
          currentValue = isSchemaObjectValue(currentValue) ? currentValue[p] : undefined;
        } else {
          parts.push('[', p.toString(), ']');
          currentValue = Array.isArray(currentValue) ? currentValue[p] : undefined;
        }
      }
      // no pseudo elements
      if (i === path.length - 1) {
        if (
          currentSchema &&
          isSchemaObject(currentSchema) &&
          isMultiSelect(validator, merger, currentSchema, rootSchema)
        ) {
          parts.push('[]');
        }
      } else {
        parts.push('.', encodedPseudoPrefix);
      }
      return parts.join('');
    }
  };
}

export function decodeOptionIndex(value: string): number | undefined {
  const index = value.lastIndexOf(DEFAULT_PSEUDO_PREFIX);
  if (index > 0) {
    const n = Number(value.substring(index + DEFAULT_PSEUDO_PREFIX.length));
    if (Number.isInteger(n)) {
      return n;
    }
  }
  return undefined;
}
