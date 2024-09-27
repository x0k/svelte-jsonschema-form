import type { Schema, SchemaValue, UiSchemaRoot } from "@/components/form";

type SampleStatus = "ok" | "broken" | "skipped";

export interface Sample {
  status: SampleStatus;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
}
