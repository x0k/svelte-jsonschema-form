import type { Config } from "../config.js";
import {
  isAdditionalPropertyKeyValidator,
  isAsyncFileListValidator,
  isAsyncFormValueValidator,
  isFormValueValidator,
} from "../validator.js";
import type { FormValue } from "../model.js";
import { InvalidValidatorError } from "../errors.js";
import {
  FORM_FIELDS_VALIDATION_MODE,
  FORM_SCHEMA,
  FORM_VALIDATOR,
} from "../internals.js";
import type { FormState } from "./state.js";
import { updateFieldErrors } from "./errors.js";

export function getFieldsValidationMode<T>(ctx: FormState<T>) {
  return ctx[FORM_FIELDS_VALIDATION_MODE];
}

export function validateField<T>(
  ctx: FormState<T>,
  config: Config,
  value: FormValue
) {
  ctx.fieldsValidation.run(config, value);
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
  return updateFieldErrors(ctx, fieldConfig.path, errors);
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
  return updateFieldErrors(ctx, config.path, errors);
}

export function validate<T>(ctx: FormState<T>) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isFormValueValidator(validator)) {
    throw new InvalidValidatorError(`expected sync from validator`);
  }
  return validator.validateFormValue(ctx[FORM_SCHEMA], ctx.value as FormValue);
}

export function validateAsync<T>(ctx: FormState<T>, signal: AbortSignal) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isAsyncFormValueValidator(validator)) {
    throw new InvalidValidatorError(`expected async form validator`);
  }
  return validator.validateFormValueAsync(
    signal,
    ctx[FORM_SCHEMA],
    ctx.value as FormValue
  );
}
