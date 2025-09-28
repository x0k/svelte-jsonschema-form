import type { Id } from "../id.js";
import type { Config } from "../config.js";
import {
  isAdditionalPropertyKeyValidator,
  isAsyncFileListValidator,
  type ValidationError,
} from "../validator.js";
import type { FormValue, Update } from "../model.js";
import {
  FORM_FIELDS_VALIDATION_MODE,
  FORM_ID_BUILDER,
  FORM_VALIDATOR,
  internalGroupErrors,
} from "../internals.js";
import type { FormState } from "./state.js";
import type { FormErrorsMap } from "../errors.js";

export function getFieldsValidationMode<T>(ctx: FormState<T>) {
  return ctx[FORM_FIELDS_VALIDATION_MODE];
}

export function getErrors<T>(ctx: FormState<T>, id: Id): string[] {
  return ctx.errors.get(id) ?? [];
}

export function getErrorsForIds<T>(ctx: FormState<T>, ids: Id[]): string[] {
  const errors: string[] = [];
  for (let i = 0; i < ids.length; i++) {
    const errs = ctx.errors.get(ids[i]!);
    if (errs) {
      for (let j = 0; j < errs.length; j++) {
        errors.push(errs[j]!);
      }
    }
  }
  return errors;
}

export function validateField<T>(
  ctx: FormState<T>,
  config: Config,
  value: FormValue
) {
  ctx.fieldsValidation.run(config, value);
}

// NOTE: The `errors` map must contain non-empty error lists
// for the `errors.size > 0` check to be useful.
export function updateErrors<T>(
  ctx: FormState<T>,
  id: Id,
  errors: Update<string[]>
): boolean {
  if (typeof errors === "function") {
    const arr = ctx.errors.get(id) ?? [];
    errors = errors(arr);
  }
  if (errors.length > 0) {
    ctx.errors.set(id, errors);
  } else {
    ctx.errors.delete(id);
  }
  return errors.length === 0;
}

export function validateAdditionalPropertyKey<T>(
  ctx: FormState<T>,
  config: Config,
  key: string,
  fieldConfig: Config
) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isAdditionalPropertyKeyValidator(validator)) {
    return true;
  }
  const errors = validator.validateAdditionalPropertyKey(key, config.schema);
  return updateErrors(ctx, fieldConfig.id, errors);
}

export async function validateFileList<T>(
  signal: AbortSignal,
  ctx: FormState<T>,
  config: Config,
  fileList: FileList
) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isAsyncFileListValidator(validator)) {
    return true;
  }
  const errors = await validator.validateFileListAsync(
    signal,
    fileList,
    config
  );
  return updateErrors(ctx, config.id, errors);
}

export function groupErrors<T>(
  ctx: FormState<T>,
  errors: ValidationError[]
): FormErrorsMap {
  return internalGroupErrors(ctx[FORM_ID_BUILDER], errors);
}
