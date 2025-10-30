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

export interface ValidatorTypes<Input, Output> {
  input: Input;
  output: Output;
}

export interface AbstractFormValueValidator<Input, Output> {
  types?: ValidatorTypes<Input, Output> | undefined;
}

export type ValidatorInferInputType<
  V extends AbstractFormValueValidator<any, any>,
> = NonNullable<V["types"]>["input"];

export type ValidatorInferOutputType<
  V extends AbstractFormValueValidator<any, any>,
> = NonNullable<V["types"]>["output"];

export interface FormValueValidator<Input, Output>
  extends AbstractFormValueValidator<Input, Output> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationResult<Output>;
}

export function isFormValueValidator<V extends Validator, Input, Output>(
  v: V
): v is V & FormValueValidator<Input, Output> {
  return "validateFormValue" in v;
}

export interface AsyncFormValueValidator<Input, Output>
  extends AbstractFormValueValidator<Input, Output> {
  validateFormValueAsync: (
    signal: AbortSignal,
    rootSchema: Schema,
    formValue: FormValue
  ) => Promise<ValidationResult<Output>>;
}

export function isAsyncFormValueValidator<V extends Validator, Input, Output>(
  v: V
): v is V & AsyncFormValueValidator<Input, Output> {
  return "validateFormValueAsync" in v;
}

export type AnyFormValueValidator<Input, Output> =
  | FormValueValidator<Input, Output>
  | AsyncFormValueValidator<Input, Output>;

export type FormValidator<Input, Output> = Validator &
  AnyFormValueValidator<Input, Output>;

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
