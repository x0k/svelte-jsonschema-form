import type { AnyKey } from "./types.js";

export type Resolver<T, C, R> = (type: T, config: C) => R;

export function prepend<T, C, R>(
  source: Resolver<T, C, R>,
  res: Resolver<T, C, R | undefined>
): Resolver<T, C, R> {
  return (type: T, c: C) => res(type, c) ?? source(type, c);
}

export function append<T, C, R>(
  source: Resolver<T, C, R | undefined>,
  res: Resolver<T, C, R>
): Resolver<T, C, R> {
  return (type: T, c: C) => source(type, c) ?? res(type, c);
}

export function fromRecord<T extends AnyKey, R>(
  record: Record<T, R>
): Resolver<T, any, R> {
  return (type) => record[type];
}
