import {
  getUiSchemaByPath,
  pathToId,
  type Config,
  type PathToIdOptions,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import type { z, ZodIssue } from "zod";

export interface ErrorsTransformerOptions extends PathToIdOptions {
  uiSchema?: UiSchemaRoot;
}

export function createErrorsTransformer(options: ErrorsTransformerOptions) {
  return (
    result: z.SafeParseReturnType<any, any>
  ): ValidationError<ZodIssue>[] => {
    if (result.success) {
      return [];
    }
    return result.error.issues.map((issue) => {
      const instanceId = pathToId(issue.path, options);
      const propertyTitle =
        getUiSchemaByPath(options.uiSchema, issue.path)?.["ui:options"]
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
  result: z.SafeParseReturnType<any, any>
): ValidationError<ZodIssue>[] {
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
