import type { SchemaDefinition } from '@sjsf/form/core';
import type { IdentifiableFieldElement } from '@sjsf/form';

export const KEY_INPUT_KEY = 'key-input' satisfies keyof IdentifiableFieldElement;
export const ONE_OF = 'oneof' satisfies keyof IdentifiableFieldElement;
export const ANY_OF = 'anyof' satisfies keyof IdentifiableFieldElement;

interface CompiledPattern {
  regExp: RegExp;
  schema: SchemaDefinition;
}

export function compilePatterns(patterns: Record<string, SchemaDefinition>) {
  const keys = Object.keys(patterns);
  const l = keys.length;
  const result: CompiledPattern[] = [];
  for (let i = 0; i < l; i++) {
    const source = keys[i]!;
    result.push({
      regExp: new RegExp(source),
      schema: patterns[source]!
    });
  }
  return result;
}