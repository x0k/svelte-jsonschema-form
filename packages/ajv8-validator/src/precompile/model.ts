import type { Trie } from "@sjsf/form/lib/trie";
import {
  isPrimitiveSchemaType,
  pickSchemaType,
  SET_OF_ARRAYS_OF_SUB_SCHEMAS,
  type SchemaKey,
  type SchemaTraverserContext,
  type SubSchemasArrayKey,
} from "@sjsf/form/core";
import {
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type FieldsValidationMode,
  type Schema,
} from "@sjsf/form/index.js";

export interface SchemaMeta {
  id: string;
  combinationBranch: boolean;
}

export type SubSchemas = Trie<string | number, SchemaMeta>;

export const DEFAULT_AUGMENT_SUFFIX = "__ag";

export function createIdFactory() {
  let id = 0;
  return () => `sjsf__${id++}`;
}

const INPUTS_VALIDATION = ON_INPUT | ON_CHANGE | ON_BLUR;
const ARRAY_VALIDATION = ON_ARRAY_CHANGE;
const OBJECT_VALIDATION = ON_OBJECT_CHANGE;
const FIELDS_VALIDATION =
  INPUTS_VALIDATION | ARRAY_VALIDATION | OBJECT_VALIDATION;

export function isCombinationBranch(ctx: SchemaTraverserContext<SchemaKey>) {
  return ctx.type === "array" && (ctx.key === "anyOf" || ctx.key === "oneOf");
}

export function isValidatableNode(
  validationMode: FieldsValidationMode,
  ctx: SchemaTraverserContext<SchemaKey>,
  node: Schema
): boolean {
  if (ctx.type === "root" || (ctx.type === "sub" && ctx.key === "if")) {
    return true;
  }
  if (node.$ref !== undefined || !(validationMode & FIELDS_VALIDATION)) {
    return false;
  }
  let { type } = node;
  if (type === undefined) {
    return Boolean(validationMode & OBJECT_VALIDATION);
  }
  if (Array.isArray(type)) {
    type = pickSchemaType(type);
  }
  if (isPrimitiveSchemaType(type)) {
    return Boolean(validationMode & INPUTS_VALIDATION);
  }
  if (type === "object") {
    return (
      Boolean(validationMode & OBJECT_VALIDATION) &&
      typeof node.additionalProperties === "object"
    );
  }
  return (
    Boolean(validationMode & ARRAY_VALIDATION) &&
    (Array.isArray(node.items)
      ? typeof node.additionalItems === "object"
      : true)
  );
}
