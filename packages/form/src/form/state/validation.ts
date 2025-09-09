import type { Validator } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import {
  AdditionalPropertyKeyError,
  type FieldError,
  type PossibleError,
} from "../errors.js";
import { isAdditionalPropertyKeyValidator } from "../validator.js";
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
  ctx.errors.set(
    fieldConfig.id,
    messages.map((message) => ({
      propertyTitle: fieldConfig.title,
      message,
      error: new AdditionalPropertyKeyError() as PossibleError<V>,
    }))
  );
  return messages.length === 0;
}
