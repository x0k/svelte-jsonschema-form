import type { Schema, SchemaValue, Validator } from "@/core/index.js";

import type { Config } from "./config.js";

export interface ValidationError<E> {
  instanceId: string;
  propertyTitle: string;
  message: string;
  error: E;
}

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

  /**
   * Additional property key validation
   */
}

export const ADDITIONAL_PROPERTY_KEY_ERROR = Symbol(
  "additional-property-key-error"
);

export type AdditionalPropertyKeyError = typeof ADDITIONAL_PROPERTY_KEY_ERROR;

export interface ExtendedFormValidator<E extends AdditionalPropertyKeyError>
  extends FormValidator<E> {
  validateAdditionalPropertyKey(
    key: string
  ): string[];
}

export function isExtendedFormValidator(
  validator: FormValidator<any> | ExtendedFormValidator<any>
): validator is ExtendedFormValidator<any> {
  return "validateAdditionalPropertyKey" in validator;
}
