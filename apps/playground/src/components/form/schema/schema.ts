import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export type Schema = JSONSchema7;
export type SchemaDefinition = Schema | boolean

export type SchemaType = JSONSchema7TypeName;

export const REF_KEY = "$ref";
export const ID_KEY = "$id";
export const PROPERTIES_KEY = "properties";
export const ITEMS_KEY = "items";

export function isConstantValueSchema(schema: Schema): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.enum) && schema.enum.length === 1)
  );
}
