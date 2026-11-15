import type { Merger, Schema, SchemaValue } from "#core/index.js";

import type { FieldPath } from "./id.js";
import type { FieldValue } from "./model.js";

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
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    options: MergeFormDataAndSchemaDefaultsOptions
  ): SchemaValue | undefined;
}
