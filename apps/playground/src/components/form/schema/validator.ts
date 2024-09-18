import type { Schema, SchemaDefinition } from "./schema";

export interface Validator<T> {
  isValid(schema: SchemaDefinition, rootSchema: Schema, formData?: T): boolean;
}
