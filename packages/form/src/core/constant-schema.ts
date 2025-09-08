// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/isConstant.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema } from "./schema.js";

export function isSchemaOfConstantValue(schema: Schema): boolean {
  return (
    schema.const !== undefined ||
    (Array.isArray(schema.enum) && schema.enum.length === 1)
  );
}

export function getSchemaConstantValue(schema: Schema) {
  const enumValues = schema.enum;
  if (Array.isArray(enumValues) && enumValues.length === 1) {
    return enumValues[0]!;
  }
  const constant = schema.const;
  if (constant !== undefined) {
    return constant;
  }
  throw new Error("schema cannot be inferred as a constant");
}
