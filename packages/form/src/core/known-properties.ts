import { resolveRef } from "./definitions.js";
import { isSchema, type Schema } from "./schema.js";

export function* getKnownProperties(
  { $ref: ref, properties, dependencies, oneOf, allOf, anyOf }: Schema,
  rootSchema: Schema,
  stack = new Set<string>()
): Generator<string> {
  if (ref) {
    if (stack.has(ref)) {
      return;
    }
    stack.add(ref);
    const resolved = resolveRef(ref, rootSchema);
    if (isSchema(resolved)) {
      yield* getKnownProperties(resolved, rootSchema, stack);
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
        if (isSchema(alternative)) {
          yield* getKnownProperties(alternative, rootSchema, stack);
        }
      }
    }
  }
  if (dependencies !== undefined) {
    for (const dependency of Object.values(dependencies)) {
      if (!Array.isArray(dependency) && isSchema(dependency)) {
        yield* getKnownProperties(dependency, rootSchema, stack);
      }
    }
  }
}
