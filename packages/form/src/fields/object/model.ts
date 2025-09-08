import { isSchemaObject } from "@/lib/json-schema/index.js";
import {
  ADDITIONAL_PROPERTY_FLAG,
  type Schema,
  type SchemaObjectValue,
} from "@/core/index.js";

export type AdditionalPropertyKey = (key: string, attempt: number) => string;

export function generateNewKey(
  value: SchemaObjectValue,
  preferredKey: string,
  additionalPropertyKey: AdditionalPropertyKey
) {
  let index = 0;
  let newKey: string;
  do {
    newKey = additionalPropertyKey(preferredKey, index++);
  } while (newKey in value);
  return newKey;
}

export function createAdditionalPropertyKey(
  preferredKey: string,
  attempt: number
) {
  return attempt === 0 ? preferredKey : `${preferredKey}-${attempt}`;
}

export function createOriginalKeysOrder(
  properties: Exclude<Schema["properties"], undefined>
): string[] {
  const order: string[] = [];
  const keys = Object.keys(properties);
  for (const key of keys) {
    const property = properties[key]!;
    if (!isSchemaObject(property) || ADDITIONAL_PROPERTY_FLAG in property) {
      continue;
    }
    order.push(key);
  }
  if (order.length < keys.length) {
    order.push("*");
  }
  return order;
}
