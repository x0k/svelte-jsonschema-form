import type { Task } from "@/lib/task.svelte.js";

import type { Config } from "./config.js";
import type { FieldValue, FormValue, Update } from "./model.js";
import type { ValidationResult } from "./validator.js";

export class FileListValidationError {}

export class InvalidValidatorError extends Error {}

export type FieldErrors = Readonly<string[]>;

export type FormValidation<Output> = Task<
  [FormValue],
  ValidationResult<Output>,
  unknown
>;

export type FieldsValidation = Task<
  [config: Config, value: FieldValue],
  Update<string[]>,
  unknown
>;
