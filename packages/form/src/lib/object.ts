export function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

const objProto = Object.prototype;

export function isRecordProto<T>(
  value: object
): value is Record<PropertyKey, T> {
  const p: unknown = Object.getPrototypeOf(value);
  return p === objProto || p === null;
}

export function isRecord<T>(value: unknown): value is Record<PropertyKey, T> {
  return isObject(value) && isRecordProto(value);
}

export function isRecordEmpty<R extends Record<string, any>>(
  rec: R | Record<string, never>
): rec is Record<string, never> {
  for (const key in rec) {
    if (Object.prototype.hasOwnProperty.call(rec, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Reads `path` off `from`, returning `defaultValue` when a segment does not resolve.
 *
 * Every segment must be an OWN property, so inherited members are never read:
 * `getValueByPath({}, ["toString"])` returns `defaultValue`, not
 * `Function.prototype.toString`. The schemas and form data walked here hold no
 * data in inherited members, and the own-property rule also makes prototype
 * internals such as `__proto__` unreachable unless they are genuine own keys.
 */
export function getValueByPath<T, R>(
  from: T,
  path: PropertyKey[],
  defaultValue?: R
): R | undefined {
  let result = from as unknown;
  for (const k of path) {
    if (
      Array.isArray(result) &&
      typeof k === "number" &&
      k >= 0 &&
      k < result.length
    ) {
      result = result[k];
      continue;
    } else if (isRecord(result) && Object.hasOwn(result, k)) {
      result = result[k];
      continue;
    }
    return defaultValue;
  }
  return result as R;
}
