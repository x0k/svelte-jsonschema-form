import { SvelteMap } from "svelte/reactivity";

import type { Task, FailedTask } from "@/lib/task.svelte.js";

import type { FieldValue, FormValue } from "./model.js";
import type { Id } from "./id.js";
import type {
  AdditionalPropertyKeyValidator,
  AsyncFieldValueValidatorError,
  AsyncFormValueValidatorError,
  FieldValueValidatorError,
  FormValueValidatorError,
  ValidationError,
} from "./validator.js";
import type { Config } from "./config.js";

export class AdditionalPropertyKeyError {}

export class ValidationProcessError {
  constructor(public state: FailedTask<unknown>) {}
}

export class InvalidValidatorError extends Error {}

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

export interface FormValidationResult<E> {
  formValue: FormValue;
  formErrors: FieldErrorsMap<E>;
}

export type FormSubmission<V> = Task<
  [event: SubmitEvent],
  FormValidationResult<AnyFormValueValidatorError<V>>,
  unknown
>;

export type FieldsValidation<V> = Task<
  [config: Config, value: FieldValue],
  FieldError<AnyFieldValueValidatorError<V>>[],
  unknown
>;

export function groupErrors<E>(
  errors: ValidationError<E>[]
): FieldErrorsMap<E> {
  return new SvelteMap(SvelteMap.groupBy(errors, (error) => error.instanceId));
}
