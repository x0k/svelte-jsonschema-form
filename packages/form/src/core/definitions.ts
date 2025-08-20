// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/findSchemaDefinition.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import jsonpointer from "jsonpointer";

import { isSchemaObject } from "@/lib/json-schema/index.js";

import { REF_KEY, type Schema, type SchemaDefinition } from "./schema.js";
import { mergeSchemas } from "./merge.js";

export function resolveRef(ref: string, rootSchema: Schema) {
  if (!ref.startsWith("#")) {
    throw new Error(`Invalid reference: ${ref}, must start with #`);
  }
  const schemaDef: SchemaDefinition | undefined = jsonpointer.get(
    rootSchema,
    decodeURIComponent(ref.substring(1))
  );
  if (schemaDef === undefined) {
    throw new Error(`Could not find a definition for ${ref}.`);
  }
  return schemaDef;
}

export function findSchemaDefinition(
  ref: string,
  rootSchema: Schema,
  stack = new Set<string>()
): Schema {
  const current = resolveRef(ref, rootSchema);
  if (!isSchemaObject(current)) {
    throw new Error(`Definition for ${ref} should be a schema (object)`);
  }
  const nextRef = current[REF_KEY];
  if (nextRef) {
    // Check for circular references.
    if (stack.has(nextRef)) {
      if (stack.size === 1) {
        throw new Error(`Definition for ${ref} is a circular reference`);
      }
      const refs = Array.from(stack);
      const firstRef = refs[0]!;
      refs.push(ref, firstRef);
      throw new Error(
        `Definition for ${firstRef} contains a circular reference through ${refs.join(
          " -> "
        )}`
      );
    }
    const subSchema = findSchemaDefinition(
      nextRef,
      rootSchema,
      new Set(stack).add(ref)
    );
    if (Object.keys(current).length < 2) {
      return subSchema;
    }
    const { [REF_KEY]: _, ...currentSchema } = current;
    return mergeSchemas(currentSchema, subSchema);
  }
  return current;
}
