import type { ReadonlySchemaValue, SchemaDefinition } from "./schema.js";

export interface Validator {
  isValid(
    schema: SchemaDefinition,
    formValue: ReadonlySchemaValue | undefined
  ): boolean;
}
