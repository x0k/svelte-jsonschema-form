import type { Schema, SchemaDefinition, SchemaValue } from "./schema";

export interface Validator {
  isValid(schema: SchemaDefinition, rootSchema: Schema, formData: SchemaValue | undefined): boolean;
}
