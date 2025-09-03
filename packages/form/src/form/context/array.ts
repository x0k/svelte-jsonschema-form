import type { SchemaArrayValue, Validator } from "@/core/index.js";

import type { KeyedFieldValues } from "../model.js";

import type { FormInternalContext } from "./context.js";

export function createKeyedArrayDeriver<V extends Validator>(
  ctx: FormInternalContext<V>,
  value: () => SchemaArrayValue | undefined,
  virtualKeyedArrayFactory: () => KeyedFieldValues,
  keyedArrayFactory: (v: SchemaArrayValue, g: () => number) => KeyedFieldValues
) {
  let lastKey = Number.MIN_SAFE_INTEGER;
  return () => {
    let stored: KeyedFieldValues | undefined;
    const v = value();
    if (v === undefined) {
      stored = virtualKeyedArrayFactory();
    } else {
      stored = ctx.keyedArrays.get(v);
      if (stored === undefined) {
        stored = keyedArrayFactory(v, () => lastKey++);
        ctx.keyedArrays.set(v, stored);
      }
    }
    return stored;
  };
}
