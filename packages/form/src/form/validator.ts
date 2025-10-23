import type { RPath, Schema, Validator } from "@/core/index.js";

import type { Config } from "./config.js";
import type { FieldValue, FormValue, Update } from "./model.js";

export interface ValidationError {
  path: RPath;
  message: string;
}

export interface SuccessValidationResult<Output> {
  readonly value: Output;
  readonly errors?: undefined;
}

export interface FailureValidationResult {
  readonly value: FormValue;
  readonly errors: ReadonlyArray<ValidationError>;
}

export type ValidationResult<Output> =
  | SuccessValidationResult<Output>
  | FailureValidationResult;

export interface FormValueValidator<Output> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationResult<Output>;
}

export function isFormValueValidator<V extends Validator, Output>(
  v: V
): v is V & FormValueValidator<Output> {
  return "validateFormValue" in v;
}

export interface AsyncFormValueValidator<Output> {
  validateFormValueAsync: (
    signal: AbortSignal,
    rootSchema: Schema,
    formValue: FormValue
  ) => Promise<ValidationResult<Output>>;
}

export function isAsyncFormValueValidator<V extends Validator, Output>(
  v: V
): v is V & AsyncFormValueValidator<Output> {
  return "validateFormValueAsync" in v;
}

export type AnyFormValueValidator<Output> =
  | FormValueValidator<Output>
  | AsyncFormValueValidator<Output>;

export type FormValidator<Output> = Validator & AnyFormValueValidator<Output>;

export interface FieldValueValidator {
  validateFieldValue: (
    field: Config,
    fieldValue: FieldValue
  ) => Update<string[]>;
}

export function isFieldValueValidator<V extends Validator>(
  v: V
): v is V & FieldValueValidator {
  return "validateFieldValue" in v;
}

export interface AsyncFieldValueValidator {
  validateFieldValueAsync: (
    signal: AbortSignal,
    field: Config,
    fieldValue: FieldValue
  ) => Promise<Update<string[]>>;
}

export function isAsyncFieldValueValidator<V extends Validator>(
  v: V
): v is V & AsyncFieldValueValidator {
  return "validateFieldValueAsync" in v;
}

export type AnyFieldValueValidator =
  | FieldValueValidator
  | AsyncFieldValueValidator;

export interface AdditionalPropertyKeyValidator {
  validateAdditionalPropertyKey: (
    key: string,
    schema: Schema
  ) => Update<string[]>;
}

export function isAdditionalPropertyKeyValidator<V extends Validator>(
  v: V
): v is V & AdditionalPropertyKeyValidator {
  return "validateAdditionalPropertyKey" in v;
}

export interface AsyncFileListValidator {
  validateFileListAsync: (
    signal: AbortSignal,
    fileList: FileList,
    config: Config
  ) => Promise<Update<string[]>>;
}

export function isAsyncFileListValidator(
  v: object
): v is AsyncFileListValidator {
  return "validateFileListAsync" in v;
}
