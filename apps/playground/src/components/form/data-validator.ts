import type { FormContext } from './context';
import type { Schema, SchemaValue } from "./schema";
import type { UiSchemaRoot } from "./ui-schema";

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
  message: string;
  error: E
}

export interface SchemaError
  extends AbstractValidatorError<ValidatorErrorType.SchemaError> {
  message: string
  error: Error;
}

export type ValidatorError<E> = ValidationError<E> | SchemaError;

export interface DataValidator<E> {
  validateFormData(
    ctx: FormContext,
    schema: Schema,
    formData: SchemaValue | undefined,
  ): ValidatorError<E>[];
}
