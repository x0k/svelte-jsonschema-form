import { isSchemaObjectValue, type Schema } from "./schema";

export function isFixedItems(schema: Schema): schema is Omit<
  Schema,
  "items"
> & {
  items: Schema[];
} {
  const { items } = schema;
  return (
    Array.isArray(items) && items.length > 0 && items.every(isSchemaObjectValue)
  );
}
