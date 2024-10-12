import type { Schema, SchemaValue, UiSchemaRoot, Errors } from "@sjsf/form";
import type { AjvValidator } from "@sjsf/ajv8-validator";

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: Errors;
  Validator?: typeof AjvValidator;
}
