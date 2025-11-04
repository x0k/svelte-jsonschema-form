import {
  DEFAULT_ID_PREFIX,
  decodePseudoElement,
  type FieldPath,
  type FormIdBuilder,
} from "@/form/main.js";

export interface IdOptions {
  idPrefix?: string;
  idSeparator?: string;
  idPseudoSeparator?: string;
}

export const DEFAULT_ID_SEPARATOR = ".";
export const DEFAULT_ID_PSEUDO_SEPARATOR = "::";

export function createFormIdBuilder({
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
}: IdOptions): FormIdBuilder {
  return {
    fromPath: (path: FieldPath) => {
      let str = "";
      for (let i = 0; i < path.length; i++) {
        const p = path[i]!;
        const pseudo = decodePseudoElement(p);
        str +=
          pseudo !== undefined
            ? `${idPseudoSeparator}${pseudo}`
            : `${idSeparator}${p}`;
      }
      return `${idPrefix}${str}`;
    },
  };
}
