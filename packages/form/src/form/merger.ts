import {
  defaultMerger,
  getDefaultFormState,
  type Merger,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

export interface FormMerger extends Merger {
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined;
}

export function createFormMerger(validator: Validator, rootSchema: Schema) {
  const merger: FormMerger = {
    mergeAllOf(schema) {
      return defaultMerger.mergeAllOf(schema);
    },
    mergeFormDataAndSchemaDefaults(formData, schema) {
      return getDefaultFormState(
        validator,
        merger,
        schema,
        formData,
        rootSchema
      );
    },
  };
  return merger;
}
