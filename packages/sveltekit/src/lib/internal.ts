import type { SchemaDefinition } from '@sjsf/form/core';
import type { IdentifiableFieldElement } from '@sjsf/form';

type SerializablePrimitive = string | number | boolean | null | undefined | bigint;

type SerializableSpecial =
  | Date
  | RegExp
  | Map<Serializable, Serializable>
  | Set<Serializable>
  | URL
  | URLSearchParams;

type Serializable =
  | SerializablePrimitive
  | SerializableSpecial
  | Serializable[]
  | { [key: string | number]: Serializable };

type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type SerializableKeys<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Serializable ? K : never;
}[keyof T];

export type PickOptionalSerializable<T> = Pick<T, Extract<OptionalKeys<T>, SerializableKeys<T>>>;

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

// https://stackoverflow.com/a/29202760/70894
export function* chunks(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    yield str.substring(o, o + size);
  }
}
