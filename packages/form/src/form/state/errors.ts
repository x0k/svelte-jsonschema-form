import { untrack } from "svelte";

import type { RPath } from "#core/index.js";

import type { FieldErrors } from "../errors.js";
import type { FieldPath } from "../id.js";
import { FORM_ERRORS } from "../internals.js";
import type { Update } from "../model.js";
import type { ValidationError } from "../validator.js";
import { getFieldPath } from "./internals.js";
import type { FormState } from "./state.js";

const NO_ERRORS: FieldErrors = [];

/**
 * @query
 */
export function getFieldErrors<T>(ctx: FormState<T>, path: RPath): FieldErrors {
  return ctx[FORM_ERRORS].getFieldErrors(getFieldPath(ctx, path)) ?? NO_ERRORS;
}

/**
 * @query
 */
export function getFieldsErrors<T>(
  ctx: FormState<T>,
  paths: Iterable<RPath>
): string[] {
  const errors: string[] = [];
  for (const path of paths) {
    const errs = ctx[FORM_ERRORS].getFieldErrors(getFieldPath(ctx, path));
    if (errs) {
      for (let i = 0; i < errs.length; i++) {
        errors.push(errs[i]!);
      }
    }
  }
  return errors;
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
  path: RPath,
  errors: Update<string[]>
): boolean {
  return untrack(() =>
    ctx[FORM_ERRORS].updateFieldErrors(getFieldPath(ctx, path), errors)
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
