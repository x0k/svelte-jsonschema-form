export interface NonEmptyArray<T> extends Array<T> {
  0: T
}

export const array = <R>(
  count: number,
  factory: (index: number) => R
): R[] => Array.from(new Array(count), (_, i) => factory(i))
