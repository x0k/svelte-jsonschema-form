import type { Merger, Schema, SchemaValue } from "@/core/index.js";

export interface MergeFormDataAndSchemaDefaultsOptions {
  schema: Schema;
  formData: SchemaValue | undefined;
  initialDefaultsGenerated: boolean;
}

export interface FormMerger extends Merger {
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    options: MergeFormDataAndSchemaDefaultsOptions
  ): SchemaValue | undefined;
}
