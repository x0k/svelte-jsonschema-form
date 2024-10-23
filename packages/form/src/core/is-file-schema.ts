// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isFilesArray.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { defaultMerger } from './merger.js';
import type { Merger2 } from './merger.js';
import { retrieveSchema2 } from "./resolve.js";
import { DATA_URL_FORMAT, isNormalArrayItems, type Schema } from "./schema.js";
import type { Validator } from "./validator.js";

export function isFileSchema({ type, format }: Schema) {
  return type === "string" && format === DATA_URL_FORMAT;
}

/**
 * @deprecated use `isFilesArray2`
 */
export function isFilesArray(
  validator: Validator,
  schema: Schema,
  rootSchema?: Schema,
  merger = defaultMerger,
) {
  return isFilesArray2(validator, merger, schema, rootSchema);
}

export function isFilesArray2(
  validator: Validator,
  merger: Merger2,
  schema: Schema,
  rootSchema?: Schema
) {
  const { items } = schema;
  if (isNormalArrayItems(items)) {
    const itemsSchema = retrieveSchema2(validator, merger, items, rootSchema);
    return isFileSchema(itemsSchema);
  }
  return false;
}
