import {
  getRootSchemaTitleByPath,
  getRootUiSchemaTitleByPath,
  pathToId,
  type Config,
  type PathToIdOptions,
  type Schema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import type { z, ZodIssue } from "zod";

export interface ErrorsTransformerOptions extends PathToIdOptions {
  uiSchema?: UiSchemaRoot;
}

export function createErrorsTransformer(options: ErrorsTransformerOptions) {
  return (
    result: z.SafeParseReturnType<any, any>,
    rootSchema: Schema
  ): ValidationError<ZodIssue>[] => {
    if (result.success) {
      return [];
    }
    return result.error.issues.map((issue) => {
      const instanceId = pathToId(issue.path, options);
      const propertyTitle =
        getRootUiSchemaTitleByPath(options.uiSchema ?? {}, issue.path) ??
        getRootSchemaTitleByPath(rootSchema, issue.path) ??
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

function omitInvalidTypeIssues(issue: z.ZodIssue) {
  return issue.code !== "invalid_type";
}

export function transformFieldErrors(
  config: Config,
  result: z.SafeParseReturnType<any, any>
): ValidationError<ZodIssue>[] {
  if (result.success) {
    return [];
  }
  const { issues } = result.error;
  return (config.required ? issues : issues.filter(omitInvalidTypeIssues)).map(
    (issue) => ({
      instanceId: config.id,
      propertyTitle: config.title,
      message: issue.message,
      error: issue,
    })
  );
}
