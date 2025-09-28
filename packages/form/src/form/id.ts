import type { Brand } from "@/lib/types.js";
import type { Path } from "@/core/index.js";

export type Id = Brand<"sjsf-id">;

export interface IdentifiableFieldElement {
  help: {};
  "key-input": {};
  examples: {};
  title: {};
  description: {};
  errors: {};
  oneof: {};
  anyof: {};
  form: {};
  submit: {};
}

export type FieldPseudoElement = keyof IdentifiableFieldElement | number;

export interface FormIdBuilder {
  fromPath: (path: Path) => Id;
  pseudoId: (instanceId: Id, element: FieldPseudoElement) => Id;
}

export const DEFAULT_ID_PREFIX = "root";

const PSEUDO_PREFIX = "__sjsf_pseudo_element";
const PSEUDO_PREFIX_LEN = PSEUDO_PREFIX.length;
const STRING_SUFFIX = "S";
const NUMBER_SUFFIX = "N";

export function createPseudoPath(
  path: Path,
  element: FieldPseudoElement
): Path {
  return path.concat(
    `${PSEUDO_PREFIX}${typeof element === "string" ? STRING_SUFFIX : NUMBER_SUFFIX}${element}`
  );
}

export function tryGetPseudoElement(
  path: Path
): FieldPseudoElement | undefined {
  if (path.length === 0) {
    return;
  }
  const last = path[path.length - 1];
  if (typeof last !== "string" || !last.startsWith(PSEUDO_PREFIX)) {
    return;
  }
  const token = last.substring(PSEUDO_PREFIX_LEN + 1);
  switch (last[PSEUDO_PREFIX_LEN]) {
    case STRING_SUFFIX:
      return token as FieldPseudoElement;
    case NUMBER_SUFFIX:
      return Number(token);
    default:
      throw new Error(
        `Unexpected pseudo element suffix "${last[PSEUDO_PREFIX_LEN]}", expected "${STRING_SUFFIX}" or "${NUMBER_SUFFIX}"`
      );
  }
}

export interface FormIdBuilderToPath {
  toPath(id: Id): Path;
}

export function isFormIdBuilderToPath<B extends FormIdBuilder>(
  b: B
): b is B & FormIdBuilderToPath {
  return "toPath" in b;
}
