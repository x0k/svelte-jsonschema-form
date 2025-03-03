import type { AnyKey } from "./types.js";

export type Resolved<
  T extends AnyKey,
  R extends Record<AnyKey, any>,
> = R[T] extends never ? undefined : R[T];

export type Resolver<
  C extends Record<AnyKey, any>,
  R extends Record<AnyKey, any>,
> = <T extends keyof C>(type: T, config: C[T]) => Resolved<T, R>;

export function chain<
  C1 extends Record<AnyKey, any>,
  R1 extends Record<AnyKey, any>,
  C2 extends Record<AnyKey, any>,
  R2 extends Record<AnyKey, any>,
>(
  source: Resolver<C1, R1>,
  fallback: Resolver<C2, R2>
): Resolver<C1 & C2, R1 & R2> {
  return <T extends keyof (C1 & C2)>(type: T, c: (C1 & C2)[T]) =>
    source(type, c) ?? fallback(type, c);
}

export function fromRecord<R extends Record<AnyKey, any>>(
  record: R
): Resolver<{ [K in keyof R]: any }, R> {
  return (type) => record[type];
}

export function overrideByRecord<
  C extends Record<AnyKey, any>,
  R extends Record<AnyKey, any>,
  O extends Record<AnyKey, any>,
>(resolver: Resolver<C, R>, override: O) {
  return chain(fromRecord(override), resolver);
}
