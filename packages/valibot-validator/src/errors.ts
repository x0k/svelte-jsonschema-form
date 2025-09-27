import type { Path } from "@sjsf/form/core";
import type { ValidationError } from "@sjsf/form";
import * as v from "valibot";

import type { ValibotIssue, ValibotSchema } from "./model.js";

export function transformFormErrors(
  result: v.SafeParseResult<ValibotSchema>
): ValidationError[] {
  if (result.success) {
    return [];
  }
  return result.issues.map((issue) => {
    const path = issue.path?.map((v) => v.key as Path[number]) ?? [];
    return {
      path,
      message: issue.message,
    };
  });
}

function isRootFieldError(issue: ValibotIssue) {
  return issue.path === undefined;
}

// function isRootAndNonTypeError(issue: $ZodIssue) {
//   return isRootFieldError(issue) && issue.code !== "invalid_type";
// }

export function transformFieldErrors(
  result: v.SafeParseResult<ValibotSchema>
): string[] {
  if (result.success) {
    return [];
  }
  return (
    result.issues
      // .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
      .filter(isRootFieldError)
      .map((issue) => issue.message)
  );
}
