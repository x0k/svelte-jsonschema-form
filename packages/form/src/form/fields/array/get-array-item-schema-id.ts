import {
  type Schema,
  type SchemaArrayValue,
  type SchemaValue,
} from "@/core/schema";
import { toIdSchema, type IdSchema } from "@/core/id-schema";

import type { FormContext } from "../../context";

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
