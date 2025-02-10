import type { Path } from "@/core/index.js";
import type { Brand } from "@/lib/types.js";

export const DEFAULT_ID_PREFIX = "root";

export const DEFAULT_ID_SEPARATOR = ".";

export const DEFAULT_PSEUDO_ID_SEPARATOR = "::";

export type Id = Brand<"sjsf-id">;

export function pathToId(idPrefix: string, idSeparator: string, path: Path) {
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
  oneof: {};
  anyof: {};
}

export function computePseudoId(
  pseudoIdSeparator: string,
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number
) {
  return `${instanceId}${pseudoIdSeparator}${element}` as Id;
}
