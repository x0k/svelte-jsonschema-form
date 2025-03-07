import type { AnyKey } from "./types.js";

export type Resolved<
  T extends AnyKey,
  R extends Record<AnyKey, any>,
> = R[T] extends never ? undefined : R[T];

export type Resolver<
  C extends Record<AnyKey, any>,
  R extends Record<AnyKey, any>,
> = {
  <T extends keyof C>(type: T, config: C[T]): Resolved<T, R>;
  __configs?: C;
  __results?: R;
};

export type ResolverConfigs<R extends Resolver<any, any>> = R["__configs"];
export type ResolverResults<R extends Resolver<any, any>> = R["__results"];
export type Chain<
  R1 extends Record<AnyKey, any>,
  R2 extends Record<AnyKey, any>,
> = R1 & Omit<R2, keyof R1>;

export function chain<
  R1 extends Resolver<any, any>,
  R2 extends Resolver<any, any>,
>(
  source: R1,
  fallback: R2
): Resolver<
  Chain<ResolverConfigs<R1>, ResolverConfigs<R2>>,
  Chain<ResolverResults<R1>, ResolverResults<R2>>
> {
  return <T extends keyof Chain<ResolverConfigs<R1>, ResolverConfigs<R2>>>(
    type: T,
    c: Chain<ResolverConfigs<R1>, ResolverConfigs<R2>>[T]
  ) => source(type, c) ?? fallback(type, c);
}

export function fromRecord<R extends Record<AnyKey, any>>(
  record: R
): Resolver<{ [K in keyof R]: any }, R> {
  return (type) => record[type];
}

export function overrideByRecord<
  R extends Resolver<any, any>,
  O extends ResolverResults<R>,
>(resolver: R, override: O) {
  return chain(fromRecord(override), resolver);
}

export function extendByRecord<
  R extends Resolver<any, any>,
  E extends Record<AnyKey, any>,
>(resolver: R, extension: E) {
  return chain(resolver, fromRecord(extension));
}
