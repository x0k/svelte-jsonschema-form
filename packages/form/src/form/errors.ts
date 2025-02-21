import { SvelteMap } from "svelte/reactivity";

import type { Id } from "./id.js";
import type {
  AdditionalPropertyKeyError,
  AdditionalPropertyKeyValidator,
  FormValidator,
  ValidationError,
  ValidationProcessError,
} from "./validator.js";

export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;

export type FieldErrors<T> = FieldError<T>[];

export type FormErrors<T> = SvelteMap<Id, FieldErrors<T>>;

export type FormError<E, V extends FormValidator<E>> =
  | E
  | ValidationProcessError
  | (V extends AdditionalPropertyKeyValidator
      ? AdditionalPropertyKeyError
      : never);

export function groupErrors<E>(errors: ValidationError<E>[]): FormErrors<E> {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
