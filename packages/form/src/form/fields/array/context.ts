import { getContext, setContext } from "svelte";

import {
  isFilesArray as isFilesArrayInternal,
  type SchemaArrayValue,
  type Schema,
  type SchemaValue,
} from "@/core/index.js";

import type { ValidationError } from "../../validator.js";
import type { FormContext } from "../../context/index.js";
import { type IdSchema, toIdSchema } from "../../id-schema.js";

export interface ArrayContext {
  disabled: boolean;
  canAdd: boolean;
  addable: boolean;
  orderable: boolean;
  removable: boolean;
  copyable: boolean;
  errors: ValidationError<unknown>[];
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext(): ArrayContext {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext(ctx: ArrayContext) {
  setContext(ARRAY_CONTEXT, ctx);
}

export function getArrayItemSchemaId(
  ctx: FormContext,
  arrayIdSchema: IdSchema<SchemaArrayValue>,
  itemSchema: Schema,
  index: number,
  value: SchemaValue | undefined
) {
  const id = `${arrayIdSchema.$id}${ctx.idSeparator}${index}`;
  return toIdSchema(
    ctx.validator,
    itemSchema,
    ctx.idPrefix,
    ctx.idSeparator,
    [],
    id,
    ctx.schema,
    value
  );
}

export function isFilesArray(ctx: FormContext, schema: Schema) {
  return isFilesArrayInternal(ctx.validator, schema, ctx.schema);
}
