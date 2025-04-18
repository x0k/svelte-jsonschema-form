export type Resolved<
  T extends PropertyKey,
  R extends Record<PropertyKey, any>
> = T extends keyof R ? (R[T] extends never ? undefined : R[T]) : undefined;

export type Resolver<
  C extends Record<PropertyKey, any>,
  R extends Record<PropertyKey, any>
> = {
  <T extends keyof C>(type: T, config: C[T]): Resolved<T, R>;
  __configs?: C;
  __results?: R;
};

export type ResolverConfigs<R extends Resolver<any, any>> = Exclude<
  R["__configs"],
  undefined
>;
export type ResolverResults<R extends Resolver<any, any>> = Exclude<
  R["__results"],
  undefined
>;
export type Chain<
  R1 extends Record<PropertyKey, any>,
  R2 extends Record<PropertyKey, any>
> = R1 & Omit<R2, keyof R1>;

export function chain<
  R1 extends Resolver<any, any>,
  R2 extends Resolver<any, any>
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

export function fromRecord<R extends Record<PropertyKey, any>>(
  record: R
): Resolver<Record<keyof R, any>, R> {
  return (type) => record[type];
}

export function fromFactories<
  R extends Record<PropertyKey, (config: any) => any>
>(
  factories: R
): Resolver<
  {
    [K in keyof R]: Parameters<R[K]>[0];
  },
  {
    [K in keyof R]: ReturnType<R[K]>;
  }
> {
  return (type, config) => factories[type]?.(config);
}

export function overrideByRecord<
  R extends Resolver<any, any>,
  O extends Partial<ResolverResults<R>>
>(resolver: R, override: O) {
  return chain(fromRecord(override), resolver);
}

export function extendByRecord<
  R extends Resolver<any, any>,
  E extends Record<PropertyKey, any>
>(resolver: R, extension: E) {
  return chain(resolver, fromRecord(extension));
}
