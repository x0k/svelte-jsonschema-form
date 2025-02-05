import type { AnyKey } from "./types.js";

export type Resolver<T extends AnyKey, C, R extends Record<T, any>> = (
  type: T,
  config: C
) => R[T];

export function chain<T extends AnyKey, C, R extends Record<T, any>>(
  source: Resolver<T, C, R>,
  fallback: Resolver<T, C, R>
): Resolver<T, C, R> {
  return (type: T, c: C) => source(type, c) ?? fallback(type, c);
}

export function fromRecord<T extends AnyKey, R extends Record<T, any>>(
  record: R
): Resolver<T, any, R> {
  return (type) => record[type];
}
