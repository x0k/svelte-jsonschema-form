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
  for (let i = 0; i < a.length; i++) {
    const val = a[i]!;
    if (setB.has(val)) {
      result.push(val);
    }
  }

  return result;
}

export function isArrayEmpty<T>(arr: T[]): arr is [] {
  return arr.length === 0;
}

export function createDeduplicator<T>(compare: (a: T, b: T) => number) {
  return (arr: T[]) => {
    const sorted = arr.slice().sort(compare);
    let wIndex = 0;

    for (let rIndex = 1; rIndex < arr.length; rIndex++) {
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
