import { untrack } from "svelte";

import type { RPath } from "@/core/index.js";

import type { FieldErrors } from "../errors.js";
import type { FieldPath } from "../id.js";
import {
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  internalAssignErrors,
  internalRegisterFieldPath,
} from "../internals.js";
import type { Update } from "../model.js";
import type { ValidationError } from "../validator.js";
import type { FormState } from "./state.js";

const NO_ERRORS: FieldErrors = [];

/**
 * @query
 */
export function getFieldErrors<I, O>(
  ctx: FormState<I, O>,
  path: FieldPath
): FieldErrors {
  return ctx[FORM_ERRORS].get(path) ?? NO_ERRORS;
}

/**
 * @query
 */
export function getFieldErrorsByPath<I, O>(
  ctx: FormState<I, O>,
  path: RPath
): FieldErrors {
  return getFieldErrors(
    ctx,
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path)
  );
}

/**
 * @query
 */
export function getFieldsErrors<I, O>(
  ctx: FormState<I, O>,
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

/**
 * @query
 */
export function getFieldsErrorsByPath<I, O>(
  ctx: FormState<I, O>,
  paths: RPath[]
): string[] {
  return getFieldsErrors(
    ctx,
    paths.map((p) => internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], p))
  );
}

/**
 * @command
 */
export function updateErrors<I, O>(
  ctx: FormState<I, O>,
  errors: ReadonlyArray<ValidationError>
) {
  untrack(() => {
    internalAssignErrors(ctx[FORM_PATHS_TRIE_REF], ctx[FORM_ERRORS], errors);
  });
}

// NOTE: The `errors` map must contain non-empty error lists
// for the `errors.size > 0` check to be useful.
/**
 * @command
 */
export function updateFieldErrors<I, O>(
  ctx: FormState<I, O>,
  path: FieldPath,
  errors: Update<string[]>
): boolean {
  return untrack(() => {
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
  });
}

/**
 * @command
 */
export function updateFieldErrorsByPath<I, O>(
  ctx: FormState<I, O>,
  path: RPath,
  errors: Update<string[]>
): boolean {
  return untrack(() =>
    updateFieldErrors(
      ctx,
      internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path),
      errors
    )
  );
}

/**
 * @query
 */
export function hasErrors<I, O>(ctx: FormState<I, O>) {
  return ctx[FORM_ERRORS].size > 0;
}

/**
 * @query
 */
export function getErrors<I, O>(
  ctx: FormState<I, O>
): Iterable<[FieldPath, string[]]> {
  return ctx[FORM_ERRORS];
}
