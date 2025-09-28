import type { ValidationError } from "@sjsf/form";
import type { $ZodIssue, util } from "zod/v4/core";

export function transformFormErrors(
  result: util.SafeParseResult<any>
): ValidationError[] {
  if (result.success) {
    return [];
  }
  return result.error.issues.map((issue) => {
    const path = issue.path.map((v) =>
      typeof v === "symbol" ? v.toString() : v
    );
    return {
      path,
      message: issue.message,
    };
  });
}

function isRootFieldError(issue: $ZodIssue) {
  return issue.path.length === 0;
}

// function isRootAndNonTypeError(issue: $ZodIssue) {
//   return isRootFieldError(issue) && issue.code !== "invalid_type";
// }

export function transformFieldErrors(
  result: util.SafeParseResult<any>
): string[] {
  if (result.success) {
    return [];
  }
  const { issues } = result.error;
  return (
    issues
      // .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
      .filter(isRootFieldError)
      .map((issue) => issue.message)
  );
}
