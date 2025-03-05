import { SvelteMap } from "svelte/reactivity";

import type { FailedAction } from "@/lib/action.svelte.js";

import type { Id } from "./id.js";
import type {
  AdditionalPropertyKeyValidator,
  AsyncFieldValueValidatorError,
  AsyncFormValueValidatorError,
  FieldValueValidatorError,
  FormValueValidatorError,
  ValidationError,
} from "./validator.js";

export class AdditionalPropertyKeyError {}

export class ValidationProcessError {
  constructor(public state: FailedAction<unknown>) {}
}

export type FieldError<T> = Omit<ValidationError<T>, "instanceId">;

export type FieldErrorsMap<T> = SvelteMap<Id, FieldError<T>[]>;

export type AnyFieldValueValidatorError<V> =
  | FieldValueValidatorError<V>
  | AsyncFieldValueValidatorError<V>;

export type AnyFormValueValidatorError<V> =
  | FormValueValidatorError<V>
  | AsyncFormValueValidatorError<V>;

export type AnyValueValidatorError<V> =
  | AnyFormValueValidatorError<V>
  | AnyFieldValueValidatorError<V>;

export type AdditionalPropertyKeyValidatorError<V> =
  V extends AdditionalPropertyKeyValidator ? AdditionalPropertyKeyError : never;

export type PossibleError<V> =
  | ValidationProcessError
  | AnyValueValidatorError<V>
  | AdditionalPropertyKeyValidatorError<V>;

export function groupErrors<E>(
  errors: ValidationError<E>[]
): FieldErrorsMap<E> {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
