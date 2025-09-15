import type { Validator } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import {
  AdditionalPropertyKeyError,
  FileListValidationError,
  type FieldError,
  type PossibleError,
} from "../errors.js";
import {
  isAdditionalPropertyKeyValidator,
  isAsyncFileListValidator,
} from "../validator.js";
import type { FormValue } from "../model.js";
import { FORM_FIELDS_VALIDATION_MODE, FORM_VALIDATOR } from "../internals.js";
import type { FormState } from "./state.js";

export function getFieldsValidationMode<T, V extends Validator>(
  ctx: FormState<T, V>
) {
  return ctx[FORM_FIELDS_VALIDATION_MODE];
}

export function getErrors<T, V extends Validator>(
  ctx: FormState<T, V>,
  id: Id
): FieldError<PossibleError<V>>[] {
  return ctx.errors.get(id) ?? [];
}

export function validateField<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config,
  value: FormValue
) {
  ctx.fieldsValidation.run(config, value);
}

function setErrors<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config,
  messages: string[],
  error: () => PossibleError<V>
) {
  ctx.errors.set(
    config.id,
    messages.map((message) => ({
      propertyTitle: config.title,
      message,
      error: error(),
    }))
  );
}

export function validateAdditionalPropertyKey<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config,
  key: string,
  fieldConfig: Config
) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isAdditionalPropertyKeyValidator(validator)) {
    return true;
  }
  const messages = validator.validateAdditionalPropertyKey(key, config.schema);
  setErrors(
    ctx,
    fieldConfig,
    messages,
    () => new AdditionalPropertyKeyError() as PossibleError<V>
  );
  return messages.length === 0;
}

export async function validateFileList<T, V extends Validator>(
  signal: AbortSignal,
  ctx: FormState<T, V>,
  config: Config,
  fileList: FileList
) {
  const validator = ctx[FORM_VALIDATOR];
  if (!isAsyncFileListValidator(validator)) {
    return true;
  }
  const messages = await validator.validateFileListAsync(
    signal,
    fileList,
    config
  );
  setErrors(
    ctx,
    config,
    messages,
    () => new FileListValidationError() as PossibleError<V>
  );
  return messages.length === 0;
}
