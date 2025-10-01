import type { Comparator } from "@/lib/ord.js";

export function array<R>(count: number, factory: (index: number) => R): R[] {
  return Array.from(new Array(count), (_, i) => factory(i));
}

export function some<T>(
  data: T | T[],
  predicate: (item: T) => boolean
): boolean {
  return Array.isArray(data) ? data.some(predicate) : predicate(data);
}

export function unique<T>(items: Array<T>): Array<T> {
  return Array.from(new Set(items));
}

export function union<T>(larger: T[], smaller: T[]): T[] {
  const ll = larger.length;
  if (ll === 0) {
    return smaller;
  }
  let sl = smaller.length;
  if (sl === 0) {
    return larger;
  }
  if (ll < sl) {
    const tmp = larger;
    larger = smaller;
    smaller = tmp;
    sl = ll;
  }
  const data = new Set(larger);
  for (let i = 0; i < sl; i++) {
    data.add(smaller[i]!);
  }
  return Array.from(data);
}

export function intersection<T>(a: T[], b: T[]): T[] {
  const result: T[] = [];

  if (a.length === 0 || b.length === 0) {
    return result;
  }

  if (a.length > b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  const setB = new Set(b);
  for (let i = 0; i < a.length && setB.size > 0; i++) {
    const val = a[i]!;
    if (setB.delete(val)) {
      result.push(val);
    }
  }

  return result;
}

export function isArrayEmpty<T>(arr: T[]): arr is [] {
  return arr.length === 0;
}

export function createArrayComparator<T>(compare: (a: T, b: T) => number) {
  return (a: T[], b: T[]) => {
    const d = a.length - b.length;
    if (d !== 0) {
      return d;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        const d = compare(a[i]!, b[i]!);
        if (d !== 0) {
          return d;
        }
      }
    }
    return 0;
  };
}

export type Deduplicator<T> = (data: T[]) => T[];

export interface DeduplicatorOptions {
  /** @default 12 */
  threshold?: number;
}

export function createDeduplicator<T>(
  compare: Comparator<T>,
  { threshold = 12 }: DeduplicatorOptions = {}
): Deduplicator<T> {
  return (arr) => {
    const al = arr.length;

    if (al === 0) {
      return arr;
    }

    if (al <= threshold) {
      const result: T[] = [];
      let rl = 0;
      outer: for (let i = 0; i < al; i++) {
        const item = arr[i]!;
        for (let j = 0; j < rl; j++) {
          if (compare(item, result[j]!) === 0) {
            continue outer;
          }
        }
        rl = result.push(item);
      }
      return result;
    }

    const sorted = arr.slice().sort(compare);
    let wIndex = 0;

    for (let rIndex = 1; rIndex < al; rIndex++) {
      if (compare(sorted[wIndex]!, sorted[rIndex]!) !== 0) {
        if (++wIndex !== rIndex) {
          sorted[wIndex] = sorted[rIndex]!;
        }
      }
    }
    sorted.length = wIndex + 1;
    return sorted;
  };
}

export type Intersector<T> = (a: T[], b: T[]) => T[];

export function createIntersector<T>(compare: Comparator<T>): Intersector<T> {
  return (a, b) => {
    const result: T[] = [];
    let al = a.length;
    let bl = b.length;

    if (al === 0 || bl === 0) {
      return result;
    }

    if (al > bl) {
      const tmpArr = a;
      a = b;
      b = tmpArr;
      const tmpL = al;
      al = bl;
      bl = tmpL;
    }

    const aSorted = [...a].sort(compare);
    const bSorted = [...b].sort(compare);

    let i = 0,
      j = 0;
    while (i < al && j < bl) {
      const cmp = compare(aSorted[i]!, bSorted[j]!);
      if (cmp === 0) {
        // Only push if result is empty OR last pushed value is different
        if (
          result.length === 0 ||
          compare(result[result.length - 1]!, aSorted[i]!) !== 0
        ) {
          result.push(aSorted[i]!);
        }
        i++;
        j++;
      } else if (cmp < 0) {
        i++;
      } else {
        j++;
      }
    }

    return result;
  };
}
