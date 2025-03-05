import type { SchemaValue } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import type { FieldError, CombinedError } from "../errors.js";
import {
  AdditionalPropertyKeyError,
  isAdditionalPropertyKeyValidator,
  type FormValidator,
} from "../validator.js";

import type { FormContext } from "./context.js";

export function getErrors<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  id: Id
): FieldError<CombinedError<VE, V>>[] {
  return ctx.errors.get(id) ?? [];
}

export function validateField<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  config: Config,
  value: SchemaValue | undefined
) {
  ctx.fieldsValidation.run(config, value);
}

export function validateAdditionalPropertyKey<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  config: Config,
  key: string,
  fieldConfig: Config
) {
  const validator = ctx.validator;
  if (!isAdditionalPropertyKeyValidator(validator)) {
    return true;
  }
  const messages = validator.validateAdditionalPropertyKey(key, config.schema);
  ctx.errors.set(
    fieldConfig.id,
    messages.map((message) => ({
      propertyTitle: fieldConfig.title,
      message,
      error: new AdditionalPropertyKeyError() as CombinedError<VE, V>,
    }))
  );
  return messages.length === 0;
}
