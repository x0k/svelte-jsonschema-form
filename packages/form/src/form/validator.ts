import type { Schema, Validator } from "@/core/index.js";

import type { Id } from "./id.js";
import type { Config } from "./config.js";
import type { FieldValue, FormValue } from "./model.js";

export interface ValidationError<E> {
  instanceId: Id;
  propertyTitle: string;
  message: string;
  error: E;
}

export interface FormValueValidator<E> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationError<E>[];
}

export interface AsyncFormValueValidator<E> {
  validateFormValueAsync: (
    signal: AbortSignal,
    rootSchema: Schema,
    formValue: FormValue
  ) => Promise<ValidationError<E>[]>;
}

export type AnyFormValueValidator<E> =
  | FormValueValidator<E>
  | AsyncFormValueValidator<E>;

export interface FieldValueValidator<E> {
  validateFieldValue: (
    field: Config,
    fieldValue: FieldValue
  ) => ValidationError<E>[];
}

export interface AsyncFieldValueValidator<E> {
  validateFieldValueAsync: (
    signal: AbortSignal,
    field: Config,
    fieldValue: FieldValue
  ) => Promise<ValidationError<E>[]>;
}

export type AnyFieldValueValidator<E> =
  | FieldValueValidator<E>
  | AsyncFieldValueValidator<E>;

export class AdditionalPropertyKeyError {}

export interface AdditionalPropertyKeyValidator {
  validateAdditionalPropertyKey: (key: string, schema: Schema) => string[];
}

export type FormValidator<E> = Validator &
  (
    | AnyFormValueValidator<E>
    | AnyFieldValueValidator<E>
    | AdditionalPropertyKeyValidator
    | {}
  );

export function isFormValueValidator<E>(
  v: FormValidator<E>
): v is Validator & FormValueValidator<E> {
  return "validateFormValue" in v;
}

export function isAsyncFormValueValidator<E>(
  v: FormValidator<E>
): v is Validator & AsyncFormValueValidator<E> {
  return "validateFormValueAsync" in v;
}

export function isFieldValueValidator<E>(
  v: FormValidator<E>
): v is Validator & FieldValueValidator<E> {
  return "validateFieldValue" in v;
}

export function isAsyncFieldValueValidator<E>(
  v: FormValidator<E>
): v is Validator & AsyncFieldValueValidator<E> {
  return "validateFieldValueAsync" in v;
}

export function isAdditionalPropertyKeyValidator<E>(
  v: FormValidator<E>
): v is Validator & AdditionalPropertyKeyValidator {
  return "validateAdditionalPropertyKey" in v;
}
