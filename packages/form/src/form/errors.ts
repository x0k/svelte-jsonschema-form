import { SvelteMap } from "svelte/reactivity";

import type { Id } from './id.js';
import type { ValidationError } from "./validator.js";

export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;

export type FieldErrors<T> = FieldError<T>[];

export type FormErrors<T> = SvelteMap<Id, FieldErrors<T>>;

export const NO_FIELD_ERRORS: FieldErrors<any> = [];

export const NO_FORM_ERRORS: FormErrors<any> = new SvelteMap()

export function groupErrors<E>(errors: ValidationError<E>[]): FormErrors<E> {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
