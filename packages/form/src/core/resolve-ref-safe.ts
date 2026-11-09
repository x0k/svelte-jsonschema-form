import { isObject } from "#lib/object.js";

import type { SchemaDefinition } from "./schema.js";

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
