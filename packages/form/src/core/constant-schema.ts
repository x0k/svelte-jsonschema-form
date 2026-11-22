// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/isConstant.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema, SchemaDefinition } from "./schema.js";

export function isConstantValueSchema(schema: Schema): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.enum) && schema.enum.length === 1)
  );
}

export function getSchemaConstantValueSafe(schema: Schema) {
  const enumValues = schema.enum;
  if (Array.isArray(enumValues) && enumValues.length === 1) {
    return enumValues[0]!;
  }
  return schema.const;
}

export function getSchemaConstantValue(schema: Schema) {
  const value = getSchemaConstantValueSafe(schema);
  if (value !== undefined) {
    return value;
  }
  throw new Error("schema cannot be inferred as a constant");
}

/**
 * Checks whether a schema only allows the `true` value, due to `const` or a
 * single-value `enum`. Single `anyOf`/`oneOf` alternatives and any `allOf`
 * branch are checked recursively.
 *
 * Checkboxes use this to decide whether they must be marked as required: an
 * unchecked required checkbox would otherwise block HTML form submission even
 * though `false` is a valid value.
 */
export function schemaRequiresTrueValue(schema: SchemaDefinition): boolean {
  if (typeof schema === "boolean") {
    return false;
  }
  if (schema.const === true) {
    return true;
  }
  if (schema.enum?.length === 1 && schema.enum[0] === true) {
    return true;
  }
  if (schema.anyOf?.length === 1) {
    return schemaRequiresTrueValue(schema.anyOf[0]!);
  }
  if (schema.oneOf?.length === 1) {
    return schemaRequiresTrueValue(schema.oneOf[0]!);
  }
  return schema.allOf?.some(schemaRequiresTrueValue) ?? false;
}
