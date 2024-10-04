import type { Schema, SchemaValue, UiSchemaRoot, ValidatorError } from "@/components/form";

type SampleStatus = "perfect" | "ok" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
  errors?: ValidatorError<unknown>[];
}
