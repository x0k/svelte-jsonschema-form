import type { FormContext } from "../../context";
import { toIdSchema, type IdSchema } from "../../id-schema";
import type { Schema, SchemaArrayValue, SchemaValue } from "../../schema";

export function getArrayItemSchemaId(
  ctx: FormContext,
  arrayIdSchema: IdSchema<SchemaArrayValue>,
  itemSchema: Schema,
  index: number,
  value: SchemaValue | undefined
) {
  const idPrefix = `${arrayIdSchema.$id}${ctx.idSeparator}${index}`;
  return toIdSchema(
    ctx.validator,
    itemSchema,
    idPrefix,
    ctx.idSeparator,
    [],
    ctx.idPrefix,
    ctx.schema,
    value
  );
}
