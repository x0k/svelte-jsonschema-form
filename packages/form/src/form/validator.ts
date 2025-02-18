import type { Schema, Validator } from "@/core/index.js";
import type { FailedAction } from "@/create-action.svelte.js";

import type { Id } from "./id.js";
import type { Config } from "./config.js";
import type { FieldValue, FormValue } from "./model.js";

export class ValidationProcessError {
  constructor(public state: FailedAction<unknown>) {}
}

export interface ValidationError<E> {
  instanceId: Id;
  propertyTitle: string;
  message: string;
  error: E;
}

export type ValidationErrors<E> = ValidationError<E>[];

export const NO_VALIDATION_ERRORS: ValidationErrors<any> = [];

export interface SyncFormValueValidator<E> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationErrors<E>;
}

export interface AsyncFormValueValidator<E> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue,
    signal: AbortSignal
  ) => Promise<ValidationErrors<E>>;
}

export type FormValueValidator<E> =
  | SyncFormValueValidator<E>
  | AsyncFormValueValidator<E>;

export interface SyncFieldValueValidator<E> {
  validateFieldValue: (
    field: Config,
    fieldValue: FieldValue
  ) => ValidationErrors<E>;
}

export interface AsyncFieldValueValidator<E> {
  validateFieldValue: (
    field: Config,
    fieldValue: FieldValue,
    signal: AbortSignal
  ) => Promise<ValidationErrors<E>>;
}

export type FieldValueValidator<E> =
  | SyncFieldValueValidator<E>
  | AsyncFieldValueValidator<E>;

export class AdditionalPropertyKeyError {}

export interface SyncAdditionalPropertyKeyValidator {
  validateAdditionalPropertyKey: (key: string, schema: Schema) => string[];
}

export type AdditionalPropertyKeyValidator = SyncAdditionalPropertyKeyValidator;

export type FormValidator<E> = Validator &
  (
    | FormValueValidator<E>
    | FieldValueValidator<E>
    | AdditionalPropertyKeyValidator
    | {}
  );

export function isFormValueValidator<E>(
  v: FormValidator<E>
): v is Validator & FormValueValidator<E> {
  return "validateFormValue" in v;
}

export function isFieldValueValidator<E>(
  v: FormValidator<E>
): v is Validator & FieldValueValidator<E> {
  return "validateFieldValue" in v;
}

export function isAdditionalPropertyKeyValidator<E>(
  v: FormValidator<E>
): v is Validator & AdditionalPropertyKeyValidator {
  return "validateAdditionalPropertyKey" in v;
}
