export type FieldsValidationMode = number;

let iota = 0;

/** Validation is triggered on input event */
export const ON_INPUT = 1 << iota++;
/** Validation is triggered on change event */
export const ON_CHANGE = 1 << iota++;
/** Validation is triggered on blur event */
export const ON_BLUR = 1 << iota++;
/** Validation is triggered on add/remove item in array */
export const ON_ARRAY_CHANGE = 1 << iota++;
/** Validation is triggered on add/remove/rename property in object */
export const ON_OBJECT_CHANGE = 1 << iota++;

/** Validation is not triggered before first change event */
export const AFTER_CHANGED = 1 << iota++;
/** Validation is not triggered before first blur event */
export const AFTER_TOUCHED = 1 << iota++;
/** Validation is not triggered before first form submission */
export const AFTER_SUBMITTED = 1 << iota++;
