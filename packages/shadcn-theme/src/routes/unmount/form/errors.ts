import { SvelteMap } from "svelte/reactivity";

import type { ValidationError } from "./validator.js";

// export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;
// @deprecated
// TODO: Use `FieldError` instead of `ValidationError`
export type FieldErrors<T = unknown> = ValidationError<T>[];

export type Errors<T = unknown> = SvelteMap<string, FieldErrors<T>>;

export const NO_ERRORS: ValidationError<unknown>[] = [];

export function groupErrors<E>(errors: ValidationError<E>[]) {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
