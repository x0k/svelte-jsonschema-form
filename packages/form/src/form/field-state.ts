export type FieldState = number;

let iota = 0;

export const FIELD_FOCUSED = 1 << iota++;
export const FIELD_INPUTTED = 1 << iota++;
export const FIELD_CHANGED = 1 << iota++;
export const FIELD_BLURRED = 1 << iota++;
export const FIELD_SUBMITTED = 1 << iota++;
export const FIELD_INTERACTED = (1 << iota++) - 1;
