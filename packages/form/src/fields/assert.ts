import type { Range } from "@/lib/range.js";
import type { SchemaArrayValue, SchemaValue } from "@/core/index.js";

type ArrayAssert<T extends SchemaValue> = (
  arr: SchemaArrayValue | null | undefined
) => asserts arr is T[] | undefined;

function createArrayAssert<T extends SchemaValue>(
  itemName: string,
  isItem: (v: SchemaValue) => v is T
): ArrayAssert<T> {
  return (arr) => {
    const index =
      arr?.findIndex((item) => item === undefined || !isItem(item)) ?? -1;
    if (index >= 0) {
      const item = arr![index];
      throw new TypeError(
        `Expected array of "${itemName}" or "undefined", but got (${typeof item}: ${JSON.stringify(item)})`
      );
    }
  };
}

export const assertStrings: ArrayAssert<string> = createArrayAssert(
  "string",
  (v: SchemaValue): v is string => typeof v === "string"
);

export const assertFiles: ArrayAssert<File> = createArrayAssert(
  "File",
  (v): v is File => v instanceof File
);

export function assertFile(v: unknown): asserts v is File | undefined {
  if (v !== undefined && !(v instanceof File)) {
    throw new Error(
      `expected "File" or "undefined", but got (${typeof v}: ${JSON.stringify(v)})`
    );
  }
}

export function assertRange(
  v: unknown
): asserts v is Range<SchemaValue | undefined> | undefined | null {
  if (
    v === undefined ||
    v === null ||
    (typeof v === "object" && "start" in v && "end" in v)
  ) {
    return;
  }
  throw new Error(`
    expected "Range<SchemaValue | undefined>" or "null" or "undefined", but got (${typeof v}: ${JSON.stringify(v)})`);
}
