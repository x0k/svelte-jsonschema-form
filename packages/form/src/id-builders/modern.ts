import {
  DEFAULT_ID_PREFIX,
  decodePseudoElement,
  type FieldPath,
  type FormIdBuilder,
} from "@/form/main.js";

export interface IdOptions {
  idPrefix?: string;
  propertySeparator?: string;
  indexSeparator?: string;
  pseudoSeparator?: string;
}

export const DEFAULT_PROPERTY_SEPARATOR = ".";
export const DEFAULT_INDEX_SEPARATOR = "@";
export const DEFAULT_PSEUDO_SEPARATOR = "::";

export function createFormIdBuilder({
  idPrefix = DEFAULT_ID_PREFIX,
  indexSeparator = DEFAULT_INDEX_SEPARATOR,
  propertySeparator = DEFAULT_PROPERTY_SEPARATOR,
  pseudoSeparator = DEFAULT_PSEUDO_SEPARATOR,
}: IdOptions = {}): FormIdBuilder {
  return {
    fromPath: (path: FieldPath) => {
      let str = "";
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        const pseudo = decodePseudoElement(p);
        str +=
          pseudo !== undefined
            ? `${pseudoSeparator}${pseudo}`
            : `${typeof p === "string" ? propertySeparator : indexSeparator}${p}`;
      }
      return `${idPrefix}${str}`;
    },
  };
}
