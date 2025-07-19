import type { Path } from "@sjsf/form/core";
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
import * as v from "valibot";

import type { ValibotIssue, ValibotSchema } from "./model.js";

export interface ErrorsTransformerOptions extends PathToIdOptions {
  uiSchema?: UiSchemaRoot;
}

export function createErrorsTransformer(options: ErrorsTransformerOptions) {
  return (
    result: v.SafeParseResult<ValibotSchema>,
    rootSchema: Schema
  ): ValidationError<ValibotIssue>[] => {
    if (result.success) {
      return [];
    }
    return result.issues.map((issue) => {
      const issuePath = issue.path?.map((v) => v.key as Path[number]) ?? [];
      const instanceId = pathToId(issuePath, options);
      const propertyTitle =
        getRootUiSchemaTitleByPath(options.uiSchema ?? {}, issuePath) ??
        // TODO: Retrieve title from Zod metadata registry
        getRootSchemaTitleByPath(rootSchema, issuePath) ??
        issuePath[issuePath.length - 1] ??
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

function isRootFieldError(issue: ValibotIssue) {
  return issue.path === undefined;
}

// function isRootAndNonTypeError(issue: $ZodIssue) {
//   return isRootFieldError(issue) && issue.code !== "invalid_type";
// }

export function transformFieldErrors(
  config: Config,
  result: v.SafeParseResult<ValibotSchema>
): ValidationError<ValibotIssue>[] {
  if (result.success) {
    return [];
  }
  return (
    result.issues
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
