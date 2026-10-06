import {
  DEFAULT_ID_PREFIX,
  decodePseudoElement,
  type FieldPath,
  type FormIdBuilder,
} from "@sjsf/form";

import { createCodec, DEFAULT_ESCAPE_CHAR } from "./internal/codec.js";

export interface IdOptions {
  idPrefix?: string;
  propertySeparator?: string;
  indexSeparator?: string;
  pseudoSeparator?: string;
  escapeCharacter?: string;
}

export const DEFAULT_PROPERTY_SEPARATOR = ".";
export const DEFAULT_INDEX_SEPARATOR = "@";
export const DEFAULT_PSEUDO_SEPARATOR = "::";

export function createFormIdBuilder({
  idPrefix = DEFAULT_ID_PREFIX,
  indexSeparator = DEFAULT_INDEX_SEPARATOR,
  propertySeparator = DEFAULT_PROPERTY_SEPARATOR,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
  escapeCharacter = DEFAULT_ESCAPE_CHAR,
}: IdOptions = {}): FormIdBuilder {
  // Mirrors the codec the server parses names with: separator characters inside
  // a key are escaped, so `also.333` does not split into path segments.
  const codec = createCodec({
    escapeChar: escapeCharacter,
    sequencesToEncode: [propertySeparator, indexSeparator, pseudoSeparator],
  });
  return {
    fromPath: (path: FieldPath) => {
      let str = "";
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        const pseudo = decodePseudoElement(p);
        str +=
          pseudo !== undefined
            ? `${pseudoSeparator}${pseudo}`
            : `${typeof p === "string" ? propertySeparator : indexSeparator}${codec.encode(String(p))}`;
      }
      return `${codec.encode(idPrefix)}${str}`;
    },
  };
}

export function createOptionIndexDecoder(pseudoSeparator: string) {
  return (value: string): number | undefined => {
    const index = value.lastIndexOf(pseudoSeparator);
    if (index > 0) {
      const n = Number(value.substring(index + pseudoSeparator.length));
      if (Number.isInteger(n)) {
        return n;
      }
    }
    return undefined;
  };
}
