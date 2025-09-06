import type { SchemaArrayValue } from "@/core/index.js";
import type { FieldValue, KeyedFieldValues } from "@/form/index.js";

export class VirtualKeyedArray implements KeyedFieldValues {
  constructor(protected readonly setValue: (v: SchemaArrayValue) => void) {}

  key(): number {
    throw new Error(
      'Method "key" cannot be called on "VirtualKeyedArray" instance'
    );
  }

  push(value: FieldValue): void {
    this.setValue([value]);
  }

  swap(): void {
    throw new Error(
      'Method "swap" cannot be called on "VirtualKeyedArray" instance'
    );
  }

  insert(index: number, value: FieldValue): void {
    if (index !== 0) {
      throw new Error(
        `Method "insert" cannot be called on "VirtualKeyedArray" instance with those args (index=${index}), expected (0)`
      );
    }
    this.setValue([value]);
  }

  remove(): void {
    throw new Error(
      'Method "remove" cannot be called on "VirtualKeyedArray" instance'
    );
  }

  splice(start: number, count: number, ...items: FieldValue[]): FieldValue[] {
    if (start !== 0 || count !== 0) {
      throw new Error(
        `Method "splice" cannot be called on "VirtualKeyedArray" instance with those args(start=${start}, count=${count}) expected (0, 0)`
      );
    }
    this.setValue(items);
    return [];
  }
}
