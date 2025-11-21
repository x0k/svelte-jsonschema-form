import { untrack } from "svelte";

import type { RPath } from "@/core/index.js";

import type { FieldErrors } from "../errors.js";
import type { FieldPath } from "../id.js";
import {
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  internalRegisterFieldPath,
} from "../internals.js";
import type { Update } from "../model.js";
import type { ValidationError } from "../validator.js";
import type { FormState } from "./state.js";

const NO_ERRORS: FieldErrors = [];

/**
 * @query
 */
export function getFieldErrors<T>(
  ctx: FormState<T>,
  path: FieldPath
): FieldErrors {
  return ctx[FORM_ERRORS].getFieldErrors(path) ?? NO_ERRORS;
}

/**
 * @query
 */
export function getFieldErrorsByPath<T>(
  ctx: FormState<T>,
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
export function getFieldsErrors<T>(
  ctx: FormState<T>,
  paths: FieldPath[]
): string[] {
  const errors: string[] = [];
  for (let i = 0; i < paths.length; i++) {
    const errs = ctx[FORM_ERRORS].getFieldErrors(paths[i]!);
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
export function getFieldsErrorsByPath<T>(
  ctx: FormState<T>,
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
export function updateErrors<T>(
  ctx: FormState<T>,
  errors: ReadonlyArray<ValidationError>
) {
  untrack(() => {
    ctx[FORM_ERRORS].updateErrors(errors);
  });
}

/**
 * @command
 */
export function updateFieldErrors<T>(
  ctx: FormState<T>,
  path: FieldPath,
  errors: Update<string[]>
): boolean {
  return untrack(() => ctx[FORM_ERRORS].updateFieldErrors(path, errors));
}

/**
 * @command
 */
export function updateFieldErrorsByPath<T>(
  ctx: FormState<T>,
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
export function hasErrors<T>(ctx: FormState<T>) {
  return ctx[FORM_ERRORS].hasErrors();
}

/**
 * @query
 */
export function getErrors<T>(
  ctx: FormState<T>
): Iterable<[FieldPath, FieldErrors]> {
  return ctx[FORM_ERRORS];
}
