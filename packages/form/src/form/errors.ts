import { SvelteMap } from "svelte/reactivity";

import type { Task } from "@/lib/task.svelte.js";

import type { FieldValue, FormValue, Update } from "./model.js";
import type { Config } from "./config.js";
import type { FieldPath } from "./id.js";
import type { ValidationError } from "./validator.js";

export class FileListValidationError {}

export class InvalidValidatorError extends Error {}

export type FieldErrors = Readonly<string[]>;

export type FormErrorsMap = SvelteMap<FieldPath, string[]>;

export interface FormValidationResult {
  formValue: FormValue;
  formErrors: ValidationError[];
}

export type FormSubmission = Task<
  [event: SubmitEvent],
  FormValidationResult,
  unknown
>;

export type FieldsValidation = Task<
  [config: Config, value: FieldValue],
  Update<string[]>,
  unknown
>;
