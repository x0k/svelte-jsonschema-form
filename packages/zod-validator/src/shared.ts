import { getValueByPath } from "@sjsf/form/lib/object";
import {
  pathToId,
  type FieldErrors,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import type { z, ZodIssue } from "zod";

export const NO_ERRORS: FieldErrors<ZodIssue> = [];

export function makeFormDataValidationResultTransformer(
  idPrefix: string,
  idSeparator: string,
  uiSchema: UiSchemaRoot
) {
  return (
    result: z.SafeParseReturnType<any, any>
  ): ValidationError<ZodIssue>[] => {
    if (result.success) {
      return NO_ERRORS;
    }
    return result.error.issues.map((issue) => {
      const instanceId = pathToId(idPrefix, idSeparator, issue.path);
      const propertyTitle =
        getValueByPath(uiSchema, issue.path)?.["ui:options"]?.title ??
        issue.path[issue.path.length - 1] ??
        instanceId;
      return {
        instanceId,
        propertyTitle,
        message: issue.message,
        error: issue,
      };
    });
  };
}
