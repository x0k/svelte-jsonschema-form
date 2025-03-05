import { SvelteMap } from "svelte/reactivity";

import type { FailedAction } from "@/lib/action.svelte.js";

import type { Id } from "./id.js";
import type {
  AdditionalPropertyKeyError,
  AdditionalPropertyKeyValidator,
  FormValidator,
  ValidationError,
} from "./validator.js";

export class ValidationProcessError {
  constructor(public state: FailedAction<unknown>) {}
}

export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;

export type FieldErrorsMap<T> = SvelteMap<Id, FieldError<T>[]>;

export type CombinedError<E, V extends FormValidator<E>> =
  | E
  | ValidationProcessError
  | (V extends AdditionalPropertyKeyValidator
      ? AdditionalPropertyKeyError
      : never);

export function groupErrors<E>(
  errors: ValidationError<E>[]
): FieldErrorsMap<E> {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
