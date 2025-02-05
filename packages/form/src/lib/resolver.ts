import type { AnyKey } from "./types.js";

export type Resolver<
  K extends AnyKey,
  C,
  R extends Record<K, any>,
  NotFound = never,
> = <T extends K>(type: T, config: C) => R[T] | NotFound;

export function chain<K extends AnyKey, C, R extends Record<K, any>, NotFound>(
  source: Resolver<K, C, R, undefined>,
  fallback: Resolver<K, C, R, NotFound>
): Resolver<K, C, R, NotFound> {
  return <T extends K>(type: T, c: C) => source(type, c) ?? fallback(type, c);
}

export function fromRecord<T extends AnyKey, R extends Record<T, any>>(
  record: R
): Resolver<T, any, R> {
  return (type) => record[type];
}
