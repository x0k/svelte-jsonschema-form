export const array = <R>(count: number, factory: (index: number) => R): R[] =>
  Array.from(new Array(count), (_, i) => factory(i));

export function some<T>(
  data: T | T[],
  predicate: (item: T) => boolean
): boolean {
  return Array.isArray(data) ? data.some(predicate) : predicate(data);
}

export const unique = <T>(items: Array<T>): Array<T> =>
  Array.from(new Set(items));
