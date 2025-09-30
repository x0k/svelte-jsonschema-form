import type { FieldErrors } from "../errors.js";
import type { FieldPath } from "../id.js";
import {
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  internalAssignErrors,
} from "../internals.js";
import type { Update } from "../model.js";
import type { ValidationError } from "../validator.js";
import type { FormState } from "./state.js";

const NO_ERRORS: FieldErrors = [];

export function getFieldErrors<T>(
  ctx: FormState<T>,
  path: FieldPath
): FieldErrors {
  return ctx[FORM_ERRORS].get(path) ?? NO_ERRORS;
}

export function getFieldsErrors<T>(
  ctx: FormState<T>,
  paths: FieldPath[]
): string[] {
  const errors: string[] = [];
  for (let i = 0; i < paths.length; i++) {
    const errs = ctx[FORM_ERRORS].get(paths[i]!);
    if (errs) {
      for (let j = 0; j < errs.length; j++) {
        errors.push(errs[j]!);
      }
    }
  }
  return errors;
}

export function updateErrors<T>(ctx: FormState<T>, errors: ValidationError[]) {
  internalAssignErrors(ctx[FORM_PATHS_TRIE_REF], ctx[FORM_ERRORS], errors);
}

// NOTE: The `errors` map must contain non-empty error lists
// for the `errors.size > 0` check to be useful.
export function updateFieldErrors<T>(
  ctx: FormState<T>,
  path: FieldPath,
  errors: Update<string[]>
): boolean {
  if (typeof errors === "function") {
    const arr = ctx[FORM_ERRORS].get(path) ?? [];
    errors = errors(arr);
  }
  if (errors.length > 0) {
    ctx[FORM_ERRORS].set(path, errors);
  } else {
    ctx[FORM_ERRORS].delete(path);
  }
  return errors.length === 0;
}

export function hasErrors<T>(ctx: FormState<T>) {
  return ctx[FORM_ERRORS].size > 0;
}

export function getErrors<T>(
  ctx: FormState<T>
): Iterable<[FieldPath, string[]]> {
  return ctx[FORM_ERRORS];
}
