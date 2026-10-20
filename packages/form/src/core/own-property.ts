/**
 * Writes an own property, including a key named `__proto__` that a plain
 * assignment would hand to the prototype setter instead.
 */
export function setOwn<T extends object>(
  obj: T,
  key: PropertyKey,
  value: unknown
): void {
  if (key === "__proto__") {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  } else {
    (obj as Record<PropertyKey, unknown>)[key] = value;
  }
}
