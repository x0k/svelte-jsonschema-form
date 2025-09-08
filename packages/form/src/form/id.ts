import type { Brand } from "@/lib/types.js";
import type { Path } from "@/core/index.js";

export const DEFAULT_ID_PREFIX = "root";

export const DEFAULT_ID_SEPARATOR = ".";

export const DEFAULT_ID_PSEUDO_SEPARATOR = "::";

export type Id = Brand<"sjsf-id">;

export interface IdPrefixOption {
  idPrefix?: string;
}

export interface IdSeparatorOption {
  idSeparator?: string;
}

export interface IdPseudoSeparatorOption {
  idPseudoSeparator?: string;
}

export type IdOptions = IdPrefixOption &
  IdSeparatorOption &
  IdPseudoSeparatorOption;

export type PathToIdOptions = IdPrefixOption & IdSeparatorOption;

export function pathToId(
  path: Path,
  {
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
  }: PathToIdOptions = {}
) {
  return (
    path.length === 0
      ? idPrefix
      : `${idPrefix}${idSeparator}${path.join(idSeparator)}`
  ) as Id;
}

export interface IdentifiableFieldElement {
  help: {};
  "key-input": {};
  examples: {};
  title: {};
  description: {};
  errors: {};
  oneof: {};
  anyof: {};
}

export function createPseudoId(
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number,
  {
    idPseudoSeparator = DEFAULT_ID_PSEUDO_SEPARATOR,
  }: IdPseudoSeparatorOption = {}
) {
  return `${instanceId}${idPseudoSeparator}${element}` as Id;
}

export function createChildId(
  arrayOrObjectId: Id,
  indexOrProperty: number | string,
  { idSeparator = DEFAULT_ID_SEPARATOR }: IdSeparatorOption = {}
): Id {
  return `${arrayOrObjectId}${idSeparator}${indexOrProperty}` as Id;
}
