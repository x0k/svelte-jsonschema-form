export type Comparator<T> = (a: T, b: T) => number;

export type Comparable = number | string | boolean;

export function simpleComparison<T extends Comparable>(a: T, b: T) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
