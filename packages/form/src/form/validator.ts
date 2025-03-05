import type { Schema } from "@/core/index.js";

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

export interface AdditionalPropertyKeyValidator {
  validateAdditionalPropertyKey: (key: string, schema: Schema) => string[];
}

export interface FormValueValidator<E> {
  validateFormValue: (
    rootSchema: Schema,
    formValue: FormValue
  ) => ValidationError<E>[];
}

export type FormValueValidatorError<V> =
  V extends FormValueValidator<infer E> ? E : never;

export function isFormValueValidator<V extends object>(
  v: V
): v is V & FormValueValidator<FormValueValidatorError<V>> {
  return "validateFormValue" in v;
}

export type AsyncFormValueValidatorError<V> =
  V extends AsyncFormValueValidator<infer E> ? E : never;

export function isAsyncFormValueValidator<V extends object>(
  v: V
): v is V & AsyncFormValueValidator<AsyncFormValueValidatorError<V>> {
  return "validateFormValueAsync" in v;
}

export type FieldValueValidatorError<V> =
  V extends FieldValueValidator<infer E> ? E : never;

export function isFieldValueValidator<V extends object>(
  v: V
): v is V & FieldValueValidator<FieldValueValidatorError<V>> {
  return "validateFieldValue" in v;
}

export type AsyncFieldValueValidatorError<V> =
  V extends AsyncFieldValueValidator<infer E> ? E : never;

export function isAsyncFieldValueValidator<V extends object>(
  v: V
): v is V & AsyncFieldValueValidator<AsyncFieldValueValidatorError<V>> {
  return "validateFieldValueAsync" in v;
}

export function isAdditionalPropertyKeyValidator(
  v: object
): v is AdditionalPropertyKeyValidator {
  return "validateAdditionalPropertyKey" in v;
}
