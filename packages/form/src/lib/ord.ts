export type Comparator<T> = (a: T, b: T) => number;

export interface ComparableTypes {
  number: number;
  string: string;
  boolean: boolean;
  bigint: bigint;
}

export type Comparable = ComparableTypes[keyof ComparableTypes];

export function ascComparator<T extends Comparable>(a: T, b: T) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
