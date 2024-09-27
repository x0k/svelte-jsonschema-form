import type { Schema, SchemaValue, UiSchemaRoot } from "@/components/form";

type SampleStatus = "prefect" | "ok" | "broken" | "warnings" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
}
