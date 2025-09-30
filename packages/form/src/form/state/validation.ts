import type { Config } from "../config.js";
import {
  isAdditionalPropertyKeyValidator,
  isAsyncFileListValidator,
} from "../validator.js";
import type { FormValue } from "../model.js";
import {
  FORM_FIELDS_VALIDATION_MODE,
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
