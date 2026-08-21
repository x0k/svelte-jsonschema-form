import type { SchemaDefinition, SchemaValue } from "./schema.js";

export interface Validator {
  isValid(
    schema: SchemaDefinition,
    formValue: SchemaValue | undefined
  ): boolean;
}
