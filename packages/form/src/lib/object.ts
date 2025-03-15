export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isRecord<T>(value: unknown): value is Record<PropertyKey, T> {
  return isObject(value) && !Array.isArray(value);
}
