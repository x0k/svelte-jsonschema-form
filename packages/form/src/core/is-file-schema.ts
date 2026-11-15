// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/isFilesArray.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { CoreContext } from "./context.js";
import { retrieveSchema } from "./resolve.js";
import { DATA_URL_FORMAT, isNormalArrayItems, type Schema } from "./schema.js";

export function isFileSchema({ type, format }: Schema) {
  return type === "string" && format === DATA_URL_FORMAT;
}

export function isFilesArray(ctx: CoreContext, schema: Schema) {
  const { items } = schema;
  if (isNormalArrayItems(items)) {
    const itemsSchema = retrieveSchema(ctx, items);
    return isFileSchema(itemsSchema);
  }
  return false;
}
