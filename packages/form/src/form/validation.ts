export type InputsValidationMode = number;

/** Validation is triggered on input event */
export const ON_INPUT = 1;
/** Validation is triggered on change event */
export const ON_CHANGE = 2;
/** Validation is triggered on blur event */
export const ON_BLUR = 4;

/** Validation is not triggered before first change event */
export const ON_CHANGED = 8;
/** Validation is not triggered before first blur event */
export const ON_TOUCHED = 16;
/** Validation is not triggered before first form submission */
export const ON_SUBMITTED = 32;
