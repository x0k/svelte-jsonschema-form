import { pathFromLocation } from "@sjsf/form/core";
import type { FormValue, Schema, ValidationResult } from "@sjsf/form";
import type { Output } from "@hyperjump/json-schema";
import type { Localization } from "@hyperjump/json-schema-errors";

import { jsonSchemaErrors, type Context } from "./model.js";

export async function transformFormErrors<T>(
  ctx: Context,
  schema: Schema,
  data: FormValue,
  out: Output,
  localization: Localization,
): Promise<ValidationResult<T>> {
  if (out.valid) {
    return {
      value: data as T,
    };
  }
  const rawErrors = await jsonSchemaErrors(ctx, out, schema, localization);
  const errors = rawErrors.map((e) => ({
    path: pathFromLocation(e.instanceLocation, data),
    message: e.message,
  }));
  console.log({ rawErrors, errors });

  return {
    value: data,
    errors,
  };
}

export async function transformFieldErrors(
  ctx: Context,
  schema: Schema,
  out: Output,
  localization: Localization,
) {
  if (out.valid) {
    return [];
  }
  const errors = await jsonSchemaErrors(ctx, out, schema, localization);
  return errors.map((e) => e.message);
}
