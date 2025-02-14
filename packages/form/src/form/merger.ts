import {
  defaultMerger,
  getDefaultFormState,
  type Merger2,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

export interface FormMerger extends Merger2 {
  /**
   * Merges defaults of `schema` into `formData`
   */
  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined;
}

export class DefaultFormMerger implements FormMerger {
  constructor(
    protected readonly validator: Validator,
    protected readonly rootSchema: Schema
  ) {}

  mergeAllOf(schema: Schema): Schema {
    return defaultMerger.mergeAllOf(schema);
  }

  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined {
    return getDefaultFormState(
      this.validator,
      this,
      schema,
      formData,
      this.rootSchema
    );
  }
}
