import type { Schema, SchemaValue } from "@/core/index.js";

import {
  computePseudoId,
  type IdentifiableFieldElement,
  type IdSchema,
  toIdSchema2,
  pathToId2,
} from "../id-schema.js";

import type { FormContext } from "./context.js";

export function makeIdSchema(
  ctx: FormContext,
  schema: Schema,
  id?: string,
  formData?: SchemaValue
): IdSchema<SchemaValue> {
  return toIdSchema2(
    ctx.validator,
    ctx.merger,
    schema,
    ctx.idConfig.prefix,
    ctx.idConfig.propertySeparator,
    [],
    id,
    ctx.schema,
    formData
  );
}

export function makePseudoId(
  ctx: FormContext,
  instanceId: string,
  element: keyof IdentifiableFieldElement | number
) {
  return computePseudoId(ctx.idConfig.pseudoSeparator, instanceId, element);
}

export function makeIdFromPath(ctx: FormContext, path: Array<string | number>) {
  return pathToId2(ctx.idConfig, path);
}

export function makeArrayItemId(ctx: FormContext, parentId: string, index: number) {
  return `${parentId}${ctx.idConfig.indexSeparator}${index}`;
}
