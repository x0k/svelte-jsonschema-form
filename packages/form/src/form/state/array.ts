import { isSchemaArrayValue, type SchemaArrayValue } from "#core/index.js";
import { getOrInsertComputed } from "#lib/map.js";

import { FORM_KEYED_ARRAYS } from "../internals.js";
import type { KeyedFieldValues } from "../model.js";
import type { FormState } from "./state.js";

/**
 * The keyed array stored for `array`, if the form tracks one.
 *
 * Keyed arrays keep the keys of the edited array, so pushing and splicing
 * through them preserves the identity of existing items.
 */
export function getKeyedArray<T>(
  ctx: FormState<T>,
  array: SchemaArrayValue
): KeyedFieldValues | undefined {
  return ctx[FORM_KEYED_ARRAYS].get(array);
}

export function createKeyedArrayDeriver<T>(
  ctx: FormState<T>,
  value: () => SchemaArrayValue | null | undefined,
  virtualKeyedArrayFactory: () => KeyedFieldValues,
  keyedArrayFactory: (v: SchemaArrayValue, g: () => number) => KeyedFieldValues
) {
  let lastKey = Number.MIN_SAFE_INTEGER;
  return () => {
    let stored: KeyedFieldValues | undefined;
    const v = value();
    if (!isSchemaArrayValue(v)) {
      stored = virtualKeyedArrayFactory();
    } else {
      stored = getOrInsertComputed(ctx[FORM_KEYED_ARRAYS], v, (array) =>
        keyedArrayFactory(array, () => lastKey++)
      );
    }
    return stored;
  };
}
