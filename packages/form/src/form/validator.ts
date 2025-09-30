import type { RPath, Schema, Validator } from "@/core/index.js";

import type { Config } from "./config.js";
import type { FieldValue, FormValue, Update } from "./model.js";

export interface ValidationError {
  path: RPath
  message: string;
}

export interface FormValueValidator {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationError[];
}

export function isFormValueValidator<V extends Validator>(
  v: V
): v is V & FormValueValidator {
  return "validateFormValue" in v;
}

export interface AsyncFormValueValidator {
  validateFormValueAsync: (
    signal: AbortSignal,
    rootSchema: Schema,
    formValue: FormValue
  ) => Promise<ValidationError[]>;
}

export function isAsyncFormValueValidator<V extends Validator>(
  v: V
): v is V & AsyncFormValueValidator {
  return "validateFormValueAsync" in v;
}

export type AnyFormValueValidator =
  | FormValueValidator
  | AsyncFormValueValidator;

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
