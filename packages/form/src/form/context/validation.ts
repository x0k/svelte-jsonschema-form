import type { Validator } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import {
  AdditionalPropertyKeyError,
  type FieldError,
  type PossibleError,
} from "../errors.js";
import { isAdditionalPropertyKeyValidator } from "../validator.js";
import type { FormValue } from '../model.js';

import type { FormInternalContext } from "./context.js";

export function getErrors<V extends Validator>(
  ctx: FormInternalContext<V>,
  id: Id
): FieldError<PossibleError<V>>[] {
  return ctx.errors.get(id) ?? [];
}

export function validateField<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config,
  value: FormValue
) {
  ctx.fieldsValidation.run(config, value);
}

export function validateAdditionalPropertyKey<V extends Validator>(
  ctx: FormInternalContext<V>,
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
      error: new AdditionalPropertyKeyError() as PossibleError<V>,
    }))
  );
  return messages.length === 0;
}
