import { SvelteMap } from "svelte/reactivity";

import type { Task } from "@/lib/task.svelte.js";

import type { FieldValue, FormValue, Update } from "./model.js";
import type { Config } from "./config.js";
import type { Id } from "./id.js";

export class FileListValidationError {}

export class InvalidValidatorError extends Error {}

export type FormErrorsMap = SvelteMap<Id, string[]>;

export interface FormValidationResult {
  formValue: FormValue;
  formErrors: FormErrorsMap;
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
