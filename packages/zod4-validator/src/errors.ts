import {
  getRootSchemaTitleByPath,
  getRootUiSchemaTitleByPath,
  type Config,
  type FormIdBuilder,
  type Schema,
  type UiSchemaRoot,
  type ValidationError,
} from "@sjsf/form";
import type { $ZodIssue, util } from "zod/v4/core";

export interface ErrorsTransformerOptions {
  idBuilder: FormIdBuilder;
  uiSchema: UiSchemaRoot;
}

export function createErrorsTransformer({ uiSchema, idBuilder }: ErrorsTransformerOptions) {
  return (
    result: util.SafeParseResult<any>,
    rootSchema: Schema
  ): ValidationError<$ZodIssue>[] => {
    if (result.success) {
      return [];
    }
    return result.error.issues.map((issue) => {
      const issuePath = issue.path.map((v) =>
        typeof v === "symbol" ? v.toString() : v
      );
      const instanceId = idBuilder.fromPath(issuePath);
      const propertyTitle =
        getRootUiSchemaTitleByPath(uiSchema, issuePath) ??
        // TODO: Retrieve title from Zod metadata registry
        getRootSchemaTitleByPath(rootSchema, issuePath) ??
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

function isRootFieldError(issue: $ZodIssue) {
  return issue.path.length === 0;
}

// function isRootAndNonTypeError(issue: $ZodIssue) {
//   return isRootFieldError(issue) && issue.code !== "invalid_type";
// }

export function transformFieldErrors(
  config: Config,
  result: util.SafeParseResult<any>
): ValidationError<$ZodIssue>[] {
  if (result.success) {
    return [];
  }
  const { issues } = result.error;
  return (
    issues
      // .filter(config.required ? isRootFieldError : isRootAndNonTypeError)
      .filter(isRootFieldError)
      .map((issue) => ({
        instanceId: config.id,
        propertyTitle: config.title,
        message: issue.message,
        error: issue,
      }))
  );
}
