import type { SchemaArrayValue } from "@/core/index.js";

import type { KeyedFieldValues } from "../model.js";
import { FORM_KEYED_ARRAYS } from "../internals.js";
import type { FormState } from "./state.js";

export function createKeyedArrayDeriver<I, O>(
  ctx: FormState<I, O>,
  value: () => SchemaArrayValue | null | undefined,
  virtualKeyedArrayFactory: () => KeyedFieldValues,
  keyedArrayFactory: (v: SchemaArrayValue, g: () => number) => KeyedFieldValues
) {
  let lastKey = Number.MIN_SAFE_INTEGER;
  return () => {
    let stored: KeyedFieldValues | undefined;
    const v = value();
    if (!v) {
      stored = virtualKeyedArrayFactory();
    } else {
      stored = ctx[FORM_KEYED_ARRAYS].get(v);
      if (stored === undefined) {
        stored = keyedArrayFactory(v, () => lastKey++);
        ctx[FORM_KEYED_ARRAYS].set(v, stored);
      }
    }
    return stored;
  };
}
