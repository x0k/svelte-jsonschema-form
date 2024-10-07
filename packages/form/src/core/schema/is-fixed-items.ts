// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/isFixedItems.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { type Schema } from "./schema";
import { isSchemaObjectValue } from './value';

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
