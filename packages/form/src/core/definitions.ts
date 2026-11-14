// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/findSchemaDefinition.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { isSchemaObject } from "#lib/json-schema/index.js";
import { isObject } from "#lib/object.js";

import { getRootSchema, mergeSchemas, type CoreContext } from "./context.js";
import { REF_KEY, type Schema, type SchemaDefinition } from "./schema.js";

/**
 * Resolves an RFC 6901 JSON pointer against `obj`: the empty pointer is `obj`
 * itself, every other pointer is a `/`-led list of reference tokens with `~1`
 * and `~0` unescaped in that order. A token must be an OWN property, so
 * inherited members are never read: `#/__proto__` and `#/toString` find
 * nothing rather than `Object.prototype` and `Function.prototype.toString`. A
 * pointer without the leading `/` is not a JSON pointer, so it finds nothing
 * too.
 */
function getByPointer<R>(obj: R, pointer: string): R | undefined {
  if (pointer === "") {
    return obj;
  }
  if (!pointer.startsWith("/")) {
    return undefined;
  }
  let result: unknown = obj;
  for (const token of pointer.slice(1).split("/")) {
    const key = token.replaceAll("~1", "/").replaceAll("~0", "~");
    if (!isObject(result) || !Object.hasOwn(result, key)) {
      return undefined;
    }
    result = (result as Record<string, unknown>)[key];
  }
  return result as R;
}

/**
 * Resolves a local reference, returning `undefined` when `ref` is not a local
 * pointer or points at nothing.
 */
export function resolveRefSafe(
  ref: string,
  rootSchema: SchemaDefinition
): SchemaDefinition | undefined {
  if (!ref.startsWith("#")) {
    return undefined;
  }
  let pointer: string;
  try {
    pointer = decodeURIComponent(ref.substring(1));
  } catch {
    return undefined;
  }
  return getByPointer(rootSchema, pointer);
}

export function resolveRef(ctx: CoreContext, ref: string): SchemaDefinition {
  if (!ref.startsWith("#")) {
    throw new Error(`Invalid reference: ${ref}, must start with #`);
  }

  const schemaDef = resolveRefSafe(ref, getRootSchema(ctx));
  if (schemaDef === undefined) {
    throw new Error(`Could not find a definition for ${ref}.`);
  }
  return schemaDef;
}

export function findSchemaDefinition(
  ctx: CoreContext,
  ref: string,
  stack = new Set<string>()
): Schema {
  const current = resolveRef(ctx, ref);
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
      ctx,
      nextRef,
      new Set(stack).add(ref)
    );
    if (Object.keys(current).length < 2) {
      return subSchema;
    }
    const { [REF_KEY]: _, ...currentSchema } = current;
    return mergeSchemas(ctx, currentSchema, subSchema);
  }
  return current;
}
