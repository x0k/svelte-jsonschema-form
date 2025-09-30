import type { Brand } from "@/lib/types.js";
import type { RPath } from "@/core/index.js";

export type Id = Brand<"sjsf-id">;
export type FieldPath = Brand<"sjsf-path", RPath>;

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
  fromPath: (path: FieldPath) => string;
}

export const DEFAULT_ID_PREFIX = "root";

const PSEUDO_PREFIX = "__sjsf_pseudo_element";
const PSEUDO_PREFIX_LEN = PSEUDO_PREFIX.length;
const STRING_SUFFIX = "S";
const NUMBER_SUFFIX = "N";

export function encodePseudoElement(element: FieldPseudoElement): string {
  return `${PSEUDO_PREFIX}${typeof element === "string" ? STRING_SUFFIX : NUMBER_SUFFIX}${element}`;
}

export function decodePseudoElement(
  pathElement: RPath[number]
): FieldPseudoElement | undefined {
  if (
    typeof pathElement !== "string" ||
    !pathElement.startsWith(PSEUDO_PREFIX)
  ) {
    return;
  }
  const token = pathElement.substring(PSEUDO_PREFIX_LEN + 1);
  switch (pathElement[PSEUDO_PREFIX_LEN]) {
    case STRING_SUFFIX:
      return token as FieldPseudoElement;
    case NUMBER_SUFFIX:
      return Number(token);
    default:
      throw new Error(
        `Unexpected pseudo element suffix "${pathElement[PSEUDO_PREFIX_LEN]}", expected "${STRING_SUFFIX}" or "${NUMBER_SUFFIX}"`
      );
  }
}
