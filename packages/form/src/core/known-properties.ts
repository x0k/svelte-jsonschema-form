import { isSchemaObject } from "#lib/json-schema/index.js";

import { type CoreContext } from "./context.js";
import { resolveRef } from "./definitions.js";
import type { Schema } from "./schema.js";

export function* getKnownProperties(
  ctx: CoreContext,
  { $ref: ref, properties, dependencies, oneOf, allOf, anyOf }: Schema,
  stack = new Set<string>()
): Generator<string> {
  if (ref) {
    if (stack.has(ref)) {
      return;
    }
    stack.add(ref);
    const resolved = resolveRef(ctx, ref);
    if (isSchemaObject(resolved)) {
      yield* getKnownProperties(ctx, resolved, stack);
    }
    return;
  }
  if (properties) {
    for (const key of Object.keys(properties)) {
      yield key;
    }
  }
  for (const alternatives of [oneOf, allOf, anyOf]) {
    if (Array.isArray(alternatives)) {
      for (const alternative of alternatives) {
        if (isSchemaObject(alternative)) {
          yield* getKnownProperties(ctx, alternative, stack);
        }
      }
    }
  }
  if (dependencies !== undefined) {
    for (const dependency of Object.values(dependencies)) {
      if (!Array.isArray(dependency) && isSchemaObject(dependency)) {
        yield* getKnownProperties(ctx, dependency, stack);
      }
    }
  }
}
