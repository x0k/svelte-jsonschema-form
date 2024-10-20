import type { SchemaValue } from "@/core/index.js";

import type { IdSchema } from "../id-schema.js";
import type { Config } from "../config.js";
import { NO_ERRORS } from "../errors.js";

import type { FormContext } from "./context.js";

export function getErrors(ctx: FormContext, idSchema: IdSchema<SchemaValue>) {
  return ctx.errors.get(idSchema.$id) ?? NO_ERRORS;
}

export function validateField(
  ctx: FormContext,
  config: Config,
  value: SchemaValue | undefined
) {
  const errors = ctx.validator.validateFieldData(config, value);
  if (errors.length === 0) {
    ctx.errors.delete(config.idSchema.$id);
  } else {
    ctx.errors.set(config.idSchema.$id, errors);
  }
}
