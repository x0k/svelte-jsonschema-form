import type { ValueHandler, SchemaObjectValue } from "#core/index.js";
import { isRecord, setOwn } from "#lib/object.js";

import type { FieldValue } from "./model.js";

/**
 * The form's value handler: how values are compared, and how they are copied
 * before an in-place write so the previous snapshot stays intact.
 *
 * A `FormValueHandler` is assignable wherever a `ValueHandler` is expected, so
 * core helpers, validators and id builders can keep receiving the comparison
 * half.
 */
export interface FormValueHandler extends ValueHandler {
  /**
   * Copies `value` before an in-place update so the value recorded as the
   * previous one stays intact.
   *
   * The built-in services copy arrays and plain objects recursively and keep
   * other values, such as `File`, by reference. Override this to copy custom
   * container types, such as `Map` or `Set`, used by your form data.
   */
  copyForChange(value: FieldValue): FieldValue;
}

/**
 * Copies a value before an in-place write, so the previous value stays intact.
 *
 * The copy is recursive because the update callback may mutate any container
 * below the path it receives. `copy` is called for every nested value, so a
 * custom value handler can pass a copier that also handles its own container
 * types. Non-plain values such as `File` are kept by reference: the form treats
 * them as opaque, and spreading one would lose its internal slots.
 */
export function copyForChange(
  value: FieldValue,
  copy: (value: FieldValue) => FieldValue = copyForChange
): FieldValue {
  if (Array.isArray(value)) {
    return value.map((item) => copy(item));
  }
  if (isRecord(value)) {
    const result: SchemaObjectValue = {};
    for (const key of Object.keys(value)) {
      setOwn(result, key, copy(value[key] as FieldValue));
    }
    return result;
  }
  return value;
}
