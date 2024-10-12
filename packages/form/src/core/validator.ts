import type { Schema, SchemaDefinition, SchemaValue } from "./schema.js";

export interface ValidationError<E> {
  instanceId: string;
  propertyTitle: string;
  message: string;
  error: E;
}

export interface Validator<E = unknown> {
  isValid(
    schema: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean;

  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<E>[];

  reset(): void;
}
