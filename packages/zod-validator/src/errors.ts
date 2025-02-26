import { getValueByPath } from "@sjsf/form/lib/object";
import {
  pathToId,
  type Config,
  type UiSchema,
  type UiSchemaRoot,
  type ValidationErrors,
} from "@sjsf/form";
import type { z, ZodIssue } from "zod";

export interface ErrorsTransformerOptions {
  idPrefix: string;
  idSeparator: string;
  uiSchema: UiSchemaRoot;
}

export function createErrorsTransformer({
  idPrefix,
  idSeparator,
  uiSchema,
}: ErrorsTransformerOptions) {
  return (
    result: z.SafeParseReturnType<any, any>
  ): ValidationErrors<ZodIssue> => {
    if (result.success) {
      return [];
    }
    return result.error.issues.map((issue) => {
      const instanceId = pathToId(idPrefix, idSeparator, issue.path);
      const propertyTitle =
        getValueByPath<UiSchema, 0>(uiSchema, issue.path)?.["ui:options"]
          ?.title ??
        issue.path[issue.path.length - 1] ??
        instanceId;
      return {
        instanceId,
        propertyTitle: String(propertyTitle),
        message: issue.message,
        error: issue,
      };
    });
  };
}

export function transformFieldErrors(
  config: Config,
  result: z.SafeParseReturnType<any, any>,
): ValidationErrors<ZodIssue> {
  if (result.success) {
    return [];
  }
  return result.error.issues.map((issue) => {
    return {
      instanceId: config.id,
      propertyTitle: config.title,
      message: issue.message,
      error: issue,
    };
  });
}
