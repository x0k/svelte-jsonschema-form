export type Generated<T extends (...args: any) => any> =
  ReturnType<T> extends Generator<infer V> ? V : never;
