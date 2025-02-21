import type { AnyKey } from "./types.js";

export type Resolver<
  C extends Record<AnyKey, any>,
  R extends Record<K, any>,
  NotFound = never,
  K extends AnyKey = keyof C,
> = <T extends K>(type: T, config: C[T]) => R[T] | NotFound;

export function chain<
  C extends Record<AnyKey, any>,
  R extends Record<K, any>,
  NotFound,
  K extends AnyKey = keyof C,
>(
  source: Resolver<C, R, undefined, K>,
  fallback: Resolver<C, R, NotFound, K>
): Resolver<C, R, NotFound, K> {
  return <T extends K>(type: T, c: C[T]) =>
    source(type, c) ?? fallback(type, c);
}

export function fromRecord<R extends Record<AnyKey, any>, NotFound = never>(
  record: R
): Resolver<{ [K in keyof R]: any }, R, NotFound> {
  return (type) => record[type];
}
