import {
  SimpleKeyedArray,
  type KeyedArray2,
} from "@/lib/keyed-array.svelte.js";
import type { SchemaArrayValue, Validator } from "@/core/index.js";

import type { FieldValue } from "../model.js";

import type { FormInternalContext } from "./context.js";

class VirtualKeyedArray implements KeyedArray2<number, FieldValue> {
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

export function createKeyedArrayDeriver<V extends Validator>(
  ctx: FormInternalContext<V>,
  value: () => SchemaArrayValue | undefined,
  setValue: (v: SchemaArrayValue) => void
) {
  let lastKey = Number.MIN_SAFE_INTEGER;
  return () => {
    let stored: KeyedArray2<number, FieldValue> | undefined;
    const v = value();
    if (v === undefined) {
      stored = new VirtualKeyedArray(setValue);
    } else {
      stored = ctx.keyedArrays.get(v);
      if (stored === undefined) {
        stored = new SimpleKeyedArray(v, () => lastKey++);
        ctx.keyedArrays.set(v, stored);
      }
    }
    return stored;
  };
}
