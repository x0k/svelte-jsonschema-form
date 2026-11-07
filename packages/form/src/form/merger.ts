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

/**
 * A value the stale-defaults search removed, along with what the pass needs to
 * restore it or judge the replacement the defaults fill writes for it.
 */
export interface DroppedDefault {
  path: FieldPath;
  /**
   * The value that was at `path` before the drop.
   */
  value: FieldValue;
  /**
   * The schema that described `path` while it held `value`, which is what a
   * replacement the defaults fill writes is judged against.
   */
  writtenUnder: Schema | undefined;
}

export interface DropStaleDefaultsResult {
  formData: SchemaValue | undefined;
  /**
   * The values removed from `formData`, in walk order. A path's parent is never
   * listed alongside it, since a dropped key is not descended into.
   */
  dropped: readonly DroppedDefault[];
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
   * Values written since the last defaults pass. A value at one of these paths,
   * or below one, belongs to the user, even when it equals the replaced
   * branch's default.
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
   * Path keys this pass has already dropped. They are skipped so a replacement
   * the defaults fill has written is not dropped again. The search only tests
   * membership, so a caller that already keys its drops can pass that record
   * directly instead of rebuilding one per search.
   */
  droppedPaths?: ReadonlySet<string>;
  /**
   * The flag the defaults fill is running with. The search computes the same
   * defaults as that fill, so it must use the same flag.
   * @default false
   */
  initialDefaultsGenerated?: boolean;
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
   * with itself, so the search computes defaults the same way this merger's
   * `mergeFormDataAndSchemaDefaults` does. The returned entries let the form
   * put back a value no fill answered and judge a replacement at its own key.
   */
  dropStaleDefaults(options: DropStaleDefaultsOptions): DropStaleDefaultsResult;
}
