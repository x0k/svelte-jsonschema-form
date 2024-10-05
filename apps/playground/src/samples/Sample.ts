import type { Schema, SchemaValue, UiSchemaRoot, ValidatorError } from "@/core";

type SampleStatus = "perfect" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: ValidatorError<unknown>[];
}
