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
   * Optional: a custom merger can omit it to skip the stale-default pass. The
   * built-in mergers implement it.
   */
  dropStaleDefaults?(
    options: DropStaleDefaultsOptions
  ): SchemaValue | undefined;
}
