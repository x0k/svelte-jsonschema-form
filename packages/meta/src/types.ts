export type Generated<T extends (...args: any) => any> =
  ReturnType<T> extends Generator<infer V> ? V : never;

export type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;
