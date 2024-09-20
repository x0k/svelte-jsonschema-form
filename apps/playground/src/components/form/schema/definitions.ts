import jsonpointer from "jsonpointer";

import { REF_KEY, type Schema } from "./schema";
import { mergeSchemas } from "./merge";

export function findSchemaDefinition(
  ref: string,
  rootSchema: Schema,
  stack = new Set<string>()
): Schema {
  if (!ref.startsWith("#")) {
    throw new Error(`Invalid reference: ${ref}, must start with #`);
  }
  const current: Schema | undefined = jsonpointer.get(
    rootSchema,
    decodeURIComponent(ref.substring(1))
  );
  if (current === undefined) {
    throw new Error(`Could not find a definition for ${ref}.`);
  }
  const nextRef = current[REF_KEY];
  if (nextRef) {
    // Check for circular references.
    if (stack.has(nextRef)) {
      if (stack.size === 1) {
        throw new Error(`Definition for ${ref} is a circular reference`);
      }
      const refs = Array.from(stack);
      const firstRef = refs[0];
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