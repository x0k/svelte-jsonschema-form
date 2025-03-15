import {
  defaultMerger,
  getDefaultFormState,
  type Experimental_DefaultFormStateBehavior,
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

export type FormMergerOptions = Experimental_DefaultFormStateBehavior & {
  includeUndefinedValues?: boolean | "excludeObjectChildren";
};

export function createFormMerger(
  validator: Validator,
  rootSchema: Schema,
  options: FormMergerOptions = {}
) {
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
        rootSchema,
        options.includeUndefinedValues,
        options
      );
    },
  };
  return merger;
}
