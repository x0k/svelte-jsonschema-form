import type { Path } from "@/core/index.js";
import { DEFAULT_ID_PREFIX, type FormIdBuilder, type Id } from "@/form/main.js";

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
}: IdOptions = {}): FormIdBuilder {
  function createChildId(
    arrayOrObjectId: Id,
    indexOrProperty: number | string
  ): Id {
    return `${arrayOrObjectId}${idSeparator}${indexOrProperty}` as Id;
  }
  return {
    fromPath: (path: Path) =>
      (path.length === 0
        ? idPrefix
        : `${idPrefix}${idSeparator}${path.join(idSeparator)}`) as Id,
    propertyId: createChildId,
    itemId: createChildId,
    pseudoId: (instanceId, element) =>
      `${instanceId}${idPseudoSeparator}${element}` as Id,
  };
}
