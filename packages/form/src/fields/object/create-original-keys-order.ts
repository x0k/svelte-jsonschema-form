import { ADDITIONAL_PROPERTY_FLAG, isSchema, type Schema } from "@/core/index.js";

export function createOriginalKeysOrder(
  properties: Exclude<Schema["properties"], undefined>
): string[] {
  const order: string[] = [];
  const keys = Object.keys(properties);
  for (const key of keys) {
    const property = properties[key]!;
    if (!isSchema(property) || ADDITIONAL_PROPERTY_FLAG in property) {
      continue;
    }
    order.push(key);
  }
  if (order.length < keys.length) {
    order.push("*");
  }
  return order;
}
