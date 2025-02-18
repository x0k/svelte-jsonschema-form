import type { SchemaValue } from "@/core/index.js";

import type { Id } from "../id.js";
import type { Config } from "../config.js";
import type { FieldErrors } from "../errors.js";

import type { FormContext } from "./context.js";

export function getErrors<E>(ctx: FormContext<E>, id: Id): FieldErrors<E> {
  return ctx.errors.get(id) ?? [];
}

export function validateField<E>(
  ctx: FormContext<E>,
  config: Config,
  value: SchemaValue | undefined
) {
  ctx.fieldsValidation.run(config, value);
}
