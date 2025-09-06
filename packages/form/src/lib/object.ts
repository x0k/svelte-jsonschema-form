export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isRecord<T>(value: unknown): value is Record<PropertyKey, T> {
  return isObject(value) && !Array.isArray(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// TODO: Remove in v3
/** @deprecated use `isRecordEmpty` */
export const isEmptyRecord = isRecordEmpty;

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
    } else if (isRecord(result) && k in result) {
      result = result[k];
      continue;
    }
    return defaultValue;
  }
  return result as R;
}
