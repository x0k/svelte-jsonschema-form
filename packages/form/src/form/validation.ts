export type FieldsValidationMode = number;

/** Validation is triggered on input event */
export const ON_INPUT = 1;
/** Validation is triggered on change event */
export const ON_CHANGE = ON_INPUT << 1;
/** Validation is triggered on blur event */
export const ON_BLUR = ON_CHANGE << 1;
/** Validation is triggered on add/remove item in array */
export const ON_ARRAY_CHANGE = ON_BLUR << 1;
/** Validation is triggered on add/remove/rename property in object */
export const ON_OBJECT_CHANGE = ON_ARRAY_CHANGE << 1;

/** Validation is not triggered before first change event */
export const AFTER_CHANGED = ON_OBJECT_CHANGE << 1;
/** Validation is not triggered before first blur event */
export const AFTER_TOUCHED = AFTER_CHANGED << 1;
/** Validation is not triggered before first form submission */
export const AFTER_SUBMITTED = AFTER_TOUCHED << 1;
