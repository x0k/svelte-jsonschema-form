import type { Schema, SchemaValue, UiSchemaRoot } from "@/components/form";

export interface Sample {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
}
