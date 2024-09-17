import {
  ITEMS_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  type Schema,
  type SchemaDefinition,
} from "./schema";
import { findSchemaDefinition } from "./definitions";

export function resolveAllReferences(
  schema: Schema,
  rootSchema: Schema,
  stack = new Set<string>()
): Schema {
  if (typeof schema !== "object") {
    return schema;
  }

  let resolvedSchema: Schema = schema;

  const ref = resolvedSchema[REF_KEY];
  if (ref) {
    if (stack.has(ref)) {
      return resolvedSchema;
    }
    return resolveAllReferences(
      Object.assign(findSchemaDefinition(ref, rootSchema), resolvedSchema, {
        [REF_KEY]: undefined,
      }),
      rootSchema,
      new Set(stack).add(ref)
    );
  }

  const properties = resolvedSchema[PROPERTIES_KEY];
  if (properties) {
    const resolvedProps = new Map<string, SchemaDefinition>();
    for (const [key, value] of Object.entries(properties)) {
      if (typeof value === "boolean") {
        resolvedProps.set(key, value);
      } else {
        resolvedProps.set(key, resolveAllReferences(value, rootSchema, stack));
      }
    }
    resolvedSchema = {
      ...resolvedSchema,
      [PROPERTIES_KEY]: Object.fromEntries(resolvedProps),
    };
  }

  const items = resolvedSchema[ITEMS_KEY];
  if (items && !Array.isArray(items) && typeof items !== "boolean") {
    resolvedSchema = {
      ...resolvedSchema,
      items: resolveAllReferences(items, rootSchema, stack),
    };
  }
  return resolvedSchema;
}
