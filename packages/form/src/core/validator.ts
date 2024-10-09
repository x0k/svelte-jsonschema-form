import type { Schema, SchemaDefinition, SchemaValue } from "./schema.js";

export enum ValidatorErrorType {
  ValidationError = "validation-error",
  SchemaError = "schema-error",
}

export interface AbstractValidatorError<T extends ValidatorErrorType> {
  type: T;
}

export interface ValidationError<E>
  extends AbstractValidatorError<ValidatorErrorType.ValidationError> {
  instanceId: string;
  propertyTitle: string;
  message: string;
  error: E;
}

export interface SchemaError
  extends AbstractValidatorError<ValidatorErrorType.SchemaError> {
  message: string;
  error: Error;
}

export type ValidatorError<E> = ValidationError<E> | SchemaError;



export interface Validator<E = unknown> {
  isValid(
    schema: SchemaDefinition,
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): boolean;

  validateFormData(
    schema: Schema,
    formData: SchemaValue | undefined
  ): ValidatorError<E>[];

  reset(): void;
}
