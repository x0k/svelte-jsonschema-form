// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isSelect.ts and https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isMultiSelect.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isSchema, type Schema, type SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";
import { retrieveSchema2 } from "./resolve.js";
import { getSchemaConstantValue, isSchemaOfConstantValue } from "./constant-schema.js";
import { defaultMerger, type Merger2 } from "./merger.js";

export function isSelect(
  validator: Validator,
  merger: Merger2,
  theSchema: Schema,
  rootSchema: Schema
) {
  const schema = retrieveSchema2(validator, merger, theSchema, rootSchema);
  if (Array.isArray(schema.enum)) {
    return true;
  }
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(altSchemas)) {
    return altSchemas.every(
      (altSchemas) =>
        typeof altSchemas !== "boolean" && isSchemaOfConstantValue(altSchemas)
    );
  }
  return false;
}

export function getSelectOptionValues({
  enum: enumValues,
  oneOf,
  anyOf,
}: Schema): SchemaValue[] | undefined {
  if (enumValues !== undefined) {
    return enumValues;
  }
  const altSchema = oneOf ?? anyOf;
  if (altSchema === undefined) {
    return undefined;
  }
  return altSchema.map((schemaDef, i) => {
    if (!isSchema(schemaDef)) {
      throw new Error(`Invalid enum definition in altSchema.${i}`);
    }
    return getSchemaConstantValue(schemaDef);
  });
}

/**
 * @deprecated use `isMultiSelect2`
 */
export function isMultiSelect(
  validator: Validator,
  schema: Schema,
  rootSchema: Schema,
  merger = defaultMerger
) {
  return isMultiSelect2(validator, merger, schema, rootSchema);
}

export function isMultiSelect2(
  validator: Validator,
  merger: Merger2,
  schema: Schema,
  rootSchema: Schema
) {
  const items = schema.items;
  if (
    !items ||
    typeof items === "boolean" ||
    // TODO: This condition is added to satisfy TS and it looks correct.
    // But this check is missing in the original code.
    // Therefore, clarify the term `multi-select` schema
    Array.isArray(items) ||
    !schema.uniqueItems
  ) {
    return false;
  }
  return isSelect(validator, merger, items, rootSchema);
}
