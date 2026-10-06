import type { IdentifiableFieldElement } from "@sjsf/form";
import type { SchemaDefinition } from "@sjsf/form/core";

import { FORM_DATA_FILE_PREFIX } from "./model.js";

type SerializablePrimitive =
  | string
  | number
  | boolean
  | null
  | undefined
  | bigint;

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

export type PickOptionalSerializable<T> = Pick<
  T,
  Extract<OptionalKeys<T>, SerializableKeys<T>>
>;

export const KEY_INPUT_KEY =
  "key-input" satisfies keyof IdentifiableFieldElement;
export const ONE_OF = "oneof" satisfies keyof IdentifiableFieldElement;
export const ANY_OF = "anyof" satisfies keyof IdentifiableFieldElement;

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
      schema: patterns[source]!,
    });
  }
  return result;
}

// https://stackoverflow.com/a/29202760/70894
export function* chunks(str: string, size: number) {
  if (!(size > 0)) {
    throw new Error(`Chunk size must be positive, got ${size}`);
  }
  // Walk UTF-16 units, but never cut between a lead and trail surrogate: step
  // over the pair as one code point. Only the yielded substrings are
  // allocated — no intermediate arrays. `size` counts code points, not bytes,
  // so a CJK-heavy chunk can exceed `size` bytes.
  let start = 0;
  const len = str.length;
  while (start < len) {
    let end = start;
    for (let count = 0; count < size && end < len; count++) {
      let step = 1;
      const unit = str.charCodeAt(end);
      if (unit >= 0xd800 && unit <= 0xdbff && end + 1 < len) {
        const next = str.charCodeAt(end + 1);
        if (next >= 0xdc00 && next <= 0xdfff) {
          step = 2;
        }
      }
      end += step;
    }
    yield str.substring(start, end);
    start = end;
  }
}

/**
 * Hands out unique file-marker keys for a submission, disambiguating repeats
 * with an `__N` suffix. The marker namespace is shared by every chunk-mode
 * replacer and reviver — only the transport differs — so it lives here.
 */
export function createFileMarker() {
  const seen = new Set<string>();
  return (key: string) => {
    const initialKey = `${FORM_DATA_FILE_PREFIX}${key}`;
    let fdKey = initialKey;
    let i = 1;
    while (seen.has(fdKey)) fdKey = `${initialKey}__${i++}`;
    seen.add(fdKey);
    return fdKey;
  };
}

/** Whether a payload value is a file-marker reference. */
export function isFileMarker(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(FORM_DATA_FILE_PREFIX);
}
