import type { Path, Schema } from "@/core/index.js";

import type { Config } from "./config.js";
import type { FieldValue, FormValue } from "./model.js";

export interface ValidationError {
  path: Path;
  message: string;
}

export interface FormValueValidator {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationError[];
}

export function isFormValueValidator<V extends object>(
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

export function isAsyncFormValueValidator<V extends object>(
  v: V
): v is V & AsyncFormValueValidator {
  return "validateFormValueAsync" in v;
}
export interface FieldValueValidator {
  validateFieldValue: (field: Config, fieldValue: FieldValue) => string[];
}

export function isFieldValueValidator<V extends object>(
  v: V
): v is V & FieldValueValidator {
  return "validateFieldValue" in v;
}

export interface AsyncFieldValueValidator {
  validateFieldValueAsync: (
    signal: AbortSignal,
    field: Config,
    fieldValue: FieldValue
  ) => Promise<string[]>;
}

export function isAsyncFieldValueValidator<V extends object>(
  v: V
): v is V & AsyncFieldValueValidator {
  return "validateFieldValueAsync" in v;
}

export interface AdditionalPropertyKeyValidator {
  validateAdditionalPropertyKey: (key: string, schema: Schema) => string[];
}

export function isAdditionalPropertyKeyValidator(
  v: object
): v is AdditionalPropertyKeyValidator {
  return "validateAdditionalPropertyKey" in v;
}

export interface AsyncFileListValidator {
  validateFileListAsync: (
    signal: AbortSignal,
    fileList: FileList,
    config: Config
  ) => Promise<string[]>;
}

export function isAsyncFileListValidator(
  v: object
): v is AsyncFileListValidator {
  return "validateFileListAsync" in v;
}
