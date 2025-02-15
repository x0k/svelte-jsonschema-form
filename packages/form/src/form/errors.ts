import { SvelteMap } from "svelte/reactivity";

import type { Id } from './id.js';
import type { ValidationError } from "./validator.js";

export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;

export type FieldErrors<T = unknown> = FieldError<T>[];

export type FormErrors<T = unknown> = SvelteMap<Id, FieldErrors<T>>;

export const NO_ERRORS: FieldError<unknown>[] = [];

export function groupErrors<E>(errors: ValidationError<E>[]) {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
