import type {
  Merger,
  Schema,
  SchemaObjectValue,
  SchemaValue,
} from "#core/index.js";
import { isRecord, setOwn } from "#lib/object.js";

import type { FieldPath } from "./id.js";
import type { FieldValue } from "./model.js";

/**
 * Copies a value before an in-place write, so the previous value stays intact.
 *
 * The copy is recursive because the update callback may mutate any container
 * below the path it receives. `copy` is called for every nested value, so a
 * custom merger can pass a copier that also handles its own container types.
 * Non-plain values such as `File` are kept by reference: the form treats them
 * as opaque, and spreading one would lose its internal slots.
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

export interface MergeFormDataAndSchemaDefaultsOptions {
  schema: Schema;
  formData: SchemaValue | undefined;
  /**
   * @default false
   */
  initialDefaultsGenerated?: boolean;
  /**
   * @default false
   */
  includeUndefinedValues?: boolean | "excludeObjectChildren";
}

export interface FormValueChange {
  path: FieldPath;
  /**
   * A snapshot of the value at `path` before the change. Later in-place writes
   * must not alter it.
   */
  oldValue: FieldValue;
  /**
   * Whether `path` had an own value before the change. A `false` value means
   * the change created the entry, so replaying the change removes it instead of
   * writing an own `undefined`.
   *
   * Callers that construct a change by hand may omit this; it is then treated
   * as `true`.
   */
  hadOwnValue?: boolean;
}

export interface FormMerger extends Merger {
  /**
   * Copies `value` before an in-place update so the value recorded as the
   * previous one stays intact.
   *
   * The built-in mergers copy arrays and plain objects recursively and keep
   * other values, such as `File`, by reference. Override this to copy custom
   * container types, such as `Map` or `Set`, used by your form data.
   */
  copyForChange(value: FieldValue): FieldValue;
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    options: MergeFormDataAndSchemaDefaultsOptions
  ): SchemaValue | undefined;
}
