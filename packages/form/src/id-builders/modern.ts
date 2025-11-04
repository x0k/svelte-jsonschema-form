import {
  DEFAULT_ID_PREFIX,
  decodePseudoElement,
  type FieldPath,
  type FormIdBuilder,
} from "@/form/main.js";

export interface IdOptions {
  idPrefix?: string;
  separator?: string;
}

export const DEFAULT_SEPARATOR = "_";

export function createFormIdBuilder({
  idPrefix = DEFAULT_ID_PREFIX,
  separator = DEFAULT_SEPARATOR,
}: IdOptions = {}): FormIdBuilder {
  return {
    fromPath: (path: FieldPath) => {
      let str = "";
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        const pseudo = decodePseudoElement(p);
        str +=
          pseudo !== undefined
            ? `${separator}${separator}${pseudo}`
            : `${separator}${p}`;
      }
      return `${idPrefix}${str}`;
    },
  };
}
