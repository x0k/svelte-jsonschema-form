// auto-generated — do not edit. Run `npm run extract-validation-flags` to update.
import type { FieldsValidationMode } from "@sjsf/form";

/** Validation is triggered on input event */
export const ON_INPUT = 1 << 0;

/** Validation is triggered on change event */
export const ON_CHANGE = 1 << 1;

/** Validation is triggered on blur event */
export const ON_BLUR = 1 << 2;

/** Validation is triggered on add/remove item in array */
export const ON_ARRAY_CHANGE = 1 << 3;

/** Validation is triggered on add/remove/rename property in object */
export const ON_OBJECT_CHANGE = 1 << 4;

/** Validation is not triggered before first change event */
export const AFTER_CHANGED = 1 << 5;

/** Validation is not triggered before first blur event */
export const AFTER_TOUCHED = 1 << 6;

/** Validation is not triggered before first form submission */
export const AFTER_SUBMITTED = 1 << 7;

export type FieldValidationFlag = "ON_INPUT" | "ON_CHANGE" | "ON_BLUR" | "ON_ARRAY_CHANGE" | "ON_OBJECT_CHANGE" | "AFTER_CHANGED" | "AFTER_TOUCHED" | "AFTER_SUBMITTED";

export const FIELD_VALIDATION_FLAGS: Record<FieldValidationFlag, FieldsValidationMode> = {
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
  ON_ARRAY_CHANGE,
  ON_OBJECT_CHANGE,
  AFTER_CHANGED,
  AFTER_TOUCHED,
  AFTER_SUBMITTED,
};
