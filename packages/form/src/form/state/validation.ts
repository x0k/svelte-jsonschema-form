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
  const messages = validator.validateAdditionalPropertyKey(key, config.schema);
  ctx.errors.set(fieldConfig.id, messages);
  return messages.length === 0;
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
  const messages = await validator.validateFileListAsync(
    signal,
    fileList,
    config
  );
  ctx.errors.set(config.id, messages);
  return messages.length === 0;
}

export function groupErrors<T>(
  ctx: FormState<T>,
  errors: ValidationError[]
): FormErrorsMap {
  return internalGroupErrors(ctx[FORM_ID_BUILDER], errors);
}
