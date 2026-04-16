import type { FormValue, ValidationResult } from "@sjsf/form";
import type { Output } from "@hyperjump/json-schema";

export function transformFormErrors<T>(
  data: FormValue,
  out: Output,
): ValidationResult<T> {
  if (out.valid) {
    return {
      value: data as T,
    };
  }
  console.log("form", out);
  return {
    value: data,
    errors:
      out.errors?.map((e) => ({
        path: [],
        message: e.keyword,
      })) ?? [],
  };
}

export function transformFieldErrors(out: Output) {
  if (out.valid) {
    return [];
  }
  console.log("field", out);
  return out.errors?.map((e) => e.keyword) ?? [];
}
