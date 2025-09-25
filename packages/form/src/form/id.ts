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
  propertyId: (parentId: Id, property: string) => Id;
  itemId: (parentId: Id, index: number) => Id;
  pseudoId: (instanceId: Id, element: FieldPseudoElement) => Id;
}

export const DEFAULT_ID_PREFIX = "root";
