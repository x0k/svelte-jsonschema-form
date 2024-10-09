import {
  type Schema,
  type SchemaArrayValue,
  type SchemaValue,
} from "@/core/index.js";

import { toIdSchema, type IdSchema } from "../../id-schema.js";
import type { FormContext } from "../../context.js";

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
