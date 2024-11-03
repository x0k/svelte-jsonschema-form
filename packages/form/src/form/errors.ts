import { SvelteMap } from "svelte/reactivity";

import type { ValidationError } from "./validator.js";

// @deprecated
// TODO: Omit `instanceId` from `ValidationError`
export type FieldErrors<T = unknown> = ValidationError<T>[];

export type Errors<T = unknown> = SvelteMap<string, FieldErrors<T>>;

export const NO_ERRORS: ValidationError<unknown>[] = [];

export function groupErrors<E>(errors: ValidationError<E>[]) {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
