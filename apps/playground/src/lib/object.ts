import type { AnyKey, ValuesOf } from "@/lib/types";

export type ObjectOf<T> = Record<AnyKey, T>;

export function isObject<T = unknown>(
  value: unknown
): value is Record<AnyKey, T> {
  return typeof value === "object" && value !== null;
}

export type PropertyPath = AnyKey[];

export function getValueByPath<T, D extends number = 3>(
  from: T,
  key: PropertyPath,
  defaultValue?: ValuesOf<T, D>
): ValuesOf<T, D> | undefined {
  let result = from as unknown;
  for (const k of key) {
    if (Array.isArray(result) && typeof k === "number") {
      if (k >= 0 && k < result.length) {
        result = result[k];
        continue;
      }
    } else if (isObject(result) && k in result) {
      result = result[k];
      continue;
    }
    return defaultValue;
  }
  return result as ValuesOf<T, D>;
}
