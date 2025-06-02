import type { Schema, SchemaValue, UiSchemaRoot } from "@sjsf/form";

export interface Sample {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  formData: SchemaValue;
}
