import type { Schema, SchemaValue, Validator } from "@/core/index.js";
import type { FailedMutation } from "@/use-mutation.svelte.js";

import type { MaybePromise } from '@/lib/types.js';

import type { Config } from "./config.js";

export interface ValidationError<E> {
  instanceId: string;
  propertyTitle: string;
  message: string;
  error: E;
}

/**
 * @deprecated use `FormValidator2`
 */
export interface FormValidator<E = unknown> extends Validator {
  /**
   * Full form validation
   *
   * Essentially this is the `formData is T` check, but since `T` doesn't
   * extend `SchemaValue`, we don't declare this as a type guard.
   */
  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined
  ): ValidationError<E>[];

  /**
   * Individual field validation
   */
  validateFieldData(
    field: Config,
    fieldData: SchemaValue | undefined
  ): ValidationError<E>[];
}

export interface FormValidator2<E = unknown> extends Validator {
  /**
   * Full form validation
   *
   * Essentially this is the `formData is T` check, but since `T` doesn't
   * extend `SchemaValue`, we don't declare this as a type guard.
   */
  validateFormData(
    rootSchema: Schema,
    formData: SchemaValue | undefined,
    signal: AbortSignal
  ): MaybePromise<ValidationError<E>[]>;

  /**
   * Individual field validation
   */
  validateFieldData(
    field: Config,
    fieldData: SchemaValue | undefined,
    signal: AbortSignal
  ): MaybePromise<ValidationError<E>[]>;
}

// @deprecated
// TODO: Turn errors into classes to make it easier to distinguish them via `instanceof`.

export const ADDITIONAL_PROPERTY_KEY_ERROR = Symbol(
  "additional-property-key-error"
);
export type AdditionalPropertyKeyError = typeof ADDITIONAL_PROPERTY_KEY_ERROR;

export interface AdditionalPropertyKeyValidator {
  /**
   * Additional property key validation
   */
  validateAdditionalPropertyKey: (key: string) => string[];
}

export const VALIDATION_PROCESS_ERROR = Symbol("validation-process-error");

export interface ValidationProcessError {
  type: typeof VALIDATION_PROCESS_ERROR;
  state: FailedMutation<unknown>;
}
