import { retrieveSchema } from "./resolve";
import { DATA_URL_FORMAT, type Schema } from "./schema";
import type { Validator } from "./validator";

export function isFileSchema({ type, format }: Schema) {
  return type === "string" && format === DATA_URL_FORMAT;
}

export function isFilesArray(
  validator: Validator,
  schema: Schema,
  rootSchema?: Schema
) {
  const { items } = schema;
  if (typeof items === "object" && !Array.isArray(items)) {
    const itemsSchema = retrieveSchema(validator, items, rootSchema);
    return isFileSchema(itemsSchema);
  }
  return false;
}
