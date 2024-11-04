import type { Schema, SchemaValue } from "@/core/index.js";

import {
  computePseudoId,
  type IdentifiableFieldElement,
  type IdSchema,
  toIdSchema2,
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
    ctx.idPrefix,
    ctx.idSeparator,
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
  return computePseudoId(ctx.pseudoIdSeparator, instanceId, element);
}
