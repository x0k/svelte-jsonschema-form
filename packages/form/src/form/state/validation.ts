import type { Validator } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import {
  isAdditionalPropertyKeyValidator,
  isAsyncFileListValidator,
  type ValidationError,
} from "../validator.js";
import type { FormValue } from "../model.js";
import {
  FORM_FIELDS_VALIDATION_MODE,
  FORM_ID_BUILDER,
  FORM_VALIDATOR,
  internalGroupErrors,
} from "../internals.js";
import type { FormState } from "./state.js";
import type { FormErrorsMap } from "../errors.js";

export function getFieldsValidationMode<T, V extends Validator>(
  ctx: FormState<T, V>
) {
  return ctx[FORM_FIELDS_VALIDATION_MODE];
}

export function getErrors<T, V extends Validator>(
  ctx: FormState<T, V>,
  id: Id
): string[] {
  return ctx.errors.get(id) ?? [];
}

export function getErrorsForIds<T, V extends Validator>(
  ctx: FormState<T, V>,
  ids: Id[]
): string[] {
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

export function validateField<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config,
  value: FormValue
) {
  ctx.fieldsValidation.run(config, value);
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
  ctx.errors.set(fieldConfig.id, messages);
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
  ctx.errors.set(config.id, messages);
  return messages.length === 0;
}

export function groupErrors<T, V extends Validator>(
  ctx: FormState<T, V>,
  errors: ValidationError[]
): FormErrorsMap {
  return internalGroupErrors(ctx[FORM_ID_BUILDER], errors);
}
