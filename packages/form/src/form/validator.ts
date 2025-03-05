import type { FailedAction } from "@/lib/action.svelte.js";
import type { Schema, Validator } from "@/core/index.js";

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

export interface SyncFormValueValidator<E> {
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

export type FormValueValidator<E> =
  | SyncFormValueValidator<E>
  | AsyncFormValueValidator<E>;

export interface SyncFieldValueValidator<E> {
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

export function isSyncFormValueValidator<E>(
  v: FormValidator<E>
): v is Validator & SyncFormValueValidator<E> {
  return "validateFormValue" in v;
}

export function isAsyncFormValueValidator<E>(
  v: FormValidator<E>
): v is Validator & AsyncFormValueValidator<E> {
  return "validateFormValueAsync" in v;
}

export function isSyncFieldValueValidator<E>(
  v: FormValidator<E>
): v is Validator & SyncFieldValueValidator<E> {
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
