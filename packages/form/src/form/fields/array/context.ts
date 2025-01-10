import { getContext, setContext } from "svelte";

import {
  isFilesArray2 as isFilesArrayInternal,
  type SchemaArrayValue,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import type { ValidationError } from "../../validator.js";
import {
  type FormContext,
  makeArrayItemId,
  makeIdSchema,
} from "../../context/index.js";
import { type IdSchema } from "../../id-schema.js";

export interface ArrayContext {
  disabled: boolean;
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: ValidationError<unknown>[];
  /** @deprecated */
  validate: () => void;
  pushItem(itemSchema: Schema): void;
  moveItemUp(index: number): void;
  moveItemDown(index: number): void;
  copyItem(index: number): void;
  removeItem(index: number): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext(): ArrayContext {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext(ctx: ArrayContext) {
  setContext(ARRAY_CONTEXT, ctx);
}

/**
 * @deprecated use `makeIdSchema`
 */
export function getArrayItemSchemaId(
  ctx: FormContext,
  arrayIdSchema: IdSchema<SchemaArrayValue>,
  itemSchema: Schema,
  index: number,
  value: SchemaValue | undefined
) {
  return makeIdSchema(
    ctx,
    itemSchema,
    makeArrayItemId(ctx, arrayIdSchema.$id, index),
    value
  );
}
