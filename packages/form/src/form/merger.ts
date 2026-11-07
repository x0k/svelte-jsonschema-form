import type { Merger, Schema, SchemaValue, Validator } from "#core/index.js";

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
  oldValue: FieldValue;
}

export interface DropStaleDefaultsOptions {
  validator: Validator;
  rootSchema: Schema;
  /**
   * The schema resolved for the current form data.
   */
  newSchema: Schema;
  formData: SchemaValue | undefined;
  /**
   * Values written since the last defaults pass. A value at one of these paths
   * belongs to the user, even when it equals the replaced branch's default.
   */
  changes: readonly FormValueChange[];
  /**
   * The form data as it arrived, before this defaults pass dropped anything.
   * When omitted, it is rebuilt from `changes`.
   */
  oldFormData?: SchemaValue | undefined;
  /**
   * The schema resolved for `oldFormData`. When omitted, it is retrieved from
   * `rootSchema` and `oldFormData`.
   */
  oldSchema?: Schema | undefined;
  /**
   * Paths this pass has already dropped. They are skipped so a replacement the
   * defaults fill has written is not dropped again.
   */
  droppedPaths?: readonly FieldPath[];
}

export interface FormMerger extends Merger {
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    options: MergeFormDataAndSchemaDefaultsOptions
  ): SchemaValue | undefined;
  /**
   * Removes values that still hold a `default` or `const` declared by a
   * `dependencies` or `if`/`then`/`else` branch that is no longer selected, so
   * the next `mergeFormDataAndSchemaDefaults` call writes the newly selected
   * branch's default.
   *
   * A custom merger can delegate to the exported `dropStaleDefaults` helper
   * with the same `Merger` instance it uses for schema merging.
   */
  dropStaleDefaults(options: DropStaleDefaultsOptions): SchemaValue | undefined;
}
