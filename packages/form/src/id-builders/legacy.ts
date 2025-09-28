import type { Path, Schema } from "@/core/index.js";
import {
  encodePseudoElement,
  DEFAULT_ID_PREFIX,
  decodePseudoElement,
  type FieldPseudoElement,
  type FormIdBuilder,
  type Id,
} from "@/form/main.js";

export interface IdOptions {
  schema: Schema;
  idPrefix?: string;
  idSeparator?: string;
  idPseudoSeparator?: string;
}

export const DEFAULT_ID_SEPARATOR = ".";
export const DEFAULT_ID_PSEUDO_SEPARATOR = "::";

export function createFormIdBuilder({
  schema: _,
  idPrefix = DEFAULT_ID_PREFIX,
  idSeparator = DEFAULT_ID_SEPARATOR,
  idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
}: IdOptions): FormIdBuilder {
  function joinPath(path: Path) {
    let str = "";
    for (let i = 0; i < path.length; i++) {
      const p = path[i]!;
      const pseudo = decodePseudoElement(p);
      str +=
        pseudo !== undefined
          ? `${idPseudoSeparator}${pseudo}`
          : `${idSeparator}${p}`;
    }
    return str;
  }
  return {
    fromPath: (path: Path) => `${idPrefix}${joinPath(path)}` as Id,
    toPath(id) {
      if (!id.startsWith(idPrefix)) {
        throw new Error(
          `Invalid id "${id}", expected to be started with "${idPrefix}"`
        );
      }
      id = id.substring(idPrefix.length) as Id;
      // TODO: Consider `schema` during path types inference
      const pseudoIndex = id.indexOf(idPseudoSeparator);
      const path = (pseudoIndex >= 0 ? id.substring(0, pseudoIndex) : id)
        .split(idSeparator)
        .map((p) => {
          const n = Number(p);
          return Number.isInteger(n) && p.trim() !== "" ? n : p;
        });
      if (pseudoIndex >= 0) {
        const token = id.substring(pseudoIndex + idPseudoSeparator.length);
        const n = Number(token);
        path.push(
          encodePseudoElement(
            Number.isInteger(n) && token.trim() !== ""
              ? n
              : (token as FieldPseudoElement)
          )
        );
      }
      return path;
    },
  };
}
