import type { SchemaValue } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import type { FieldError, CombinedError } from "../errors.js";
import type { FormValidator } from "../validator.js";

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
