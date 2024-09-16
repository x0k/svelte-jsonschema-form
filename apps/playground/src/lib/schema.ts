import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export type Schema = JSONSchema7;

export type SchemaType = JSONSchema7TypeName;

export function typeOfValue(value: unknown): SchemaType {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  const type = typeof value;
  switch (type) {
    case "boolean":
    case "number":
    case "object":
    case "string":
      return type;
    default:
      throw new Error(`Unsupported schema type: ${type}`);
  }
}

export function typeOfSchema(schema: Schema): SchemaType | SchemaType[] {
  if (schema.type) {
    return schema.type;
  }
  if (schema.const !== undefined) {
    return typeOfValue(schema.const);
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum.length === 0 ? "null" : typeOfValue(schema.enum[0]);
  }
  if (schema.properties || schema.additionalProperties) {
    return "object";
  }
  throw new Error(`Unsupported schema type: ${JSON.stringify(schema)}`);
}

export function pickSchemaType(types: SchemaType[]): SchemaType {
  if (types.length === 0) {
    throw new Error(`Unsupported schema types: empty type array`);
  }
  const first = types[0];
  if (types.length === 1) {
    return first;
  }
  if (first === "null") {
    return types[1];
  }
  return first;
}
