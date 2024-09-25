import { retrieveSchema } from "./resolve";
import { DATA_URL_FORMAT, type Schema, type SchemaValue } from "./schema";
import type { Validator } from "./validator";

export function isFilesArray<T extends SchemaValue>(
  validator: Validator<T>,
  schema: Schema,
  rootSchema?: Schema
) {
  const { items } = schema;
  if (typeof items === "object" && !Array.isArray(items)) {
    const itemsSchema = retrieveSchema(validator, items, rootSchema);
    return (
      itemsSchema.type === "string" && itemsSchema.format === DATA_URL_FORMAT
    );
  }
  return false;
}
