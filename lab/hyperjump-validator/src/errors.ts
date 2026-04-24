import { pathFromLocation } from "@sjsf/form/core";
import type { FormValue, ValidationResult } from "@sjsf/form";
import type * as H from "@hyperjump/json-schema-errors";

export function transformFormErrors<T>(
  out: H.ValidationResult,
  data: FormValue,
): ValidationResult<T> {
  return out.valid
    ? {
        value: data as T,
      }
    : {
        value: data,
        errors: out.errors.map((e) => ({
          path: pathFromLocation(e.instanceLocation, data),
          message: e.message,
        })),
      };
}

export function transformFieldErrors(out: H.ValidationResult) {
  return out.valid ? [] : out.errors.map((e) => e.message);
}
