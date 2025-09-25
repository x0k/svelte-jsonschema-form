import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { Path, Schema } from "@/core/index.js";
import {
  getRootSchemaTitleByPath,
  getRootUiSchemaTitleByPath,
  type AsyncFormValueValidator,
  type FormIdBuilder,
  type FormValueValidator,
  type UiSchemaRoot,
  type ValidationError,
} from "@/form/main.js";

export interface ErrorsTransformerOptions {
  idBuilder: FormIdBuilder;
  uiSchema: UiSchemaRoot;
}

function issueToPath({ path }: StandardSchemaV1.Issue): Path {
  if (!path) {
    return [];
  }
  return path.map((val) => (typeof val === "object" ? val.key : val) as string);
}

function createErrorsTransformer({
  idBuilder,
  uiSchema,
}: ErrorsTransformerOptions) {
  return <O>(
    { issues }: StandardSchemaV1.Result<O>,
    rootSchema: Schema
  ): ValidationError<StandardSchemaV1.Issue>[] => {
    if (!issues) {
      return [];
    }
    return issues.map((issue) => {
      const path = issueToPath(issue);
      const instanceId = idBuilder.fromPath(path);
      const propertyTitle =
        getRootUiSchemaTitleByPath(uiSchema, path) ??
        getRootSchemaTitleByPath(rootSchema, path) ??
        path[path.length - 1] ??
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

export interface FormValidatorOptions extends ErrorsTransformerOptions {}

export function createFormValueValidator<T extends StandardSchemaV1>(
  schema: T,
  options: FormValidatorOptions
): FormValueValidator<StandardSchemaV1.Issue> {
  const transform = createErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const result = schema["~standard"].validate(formValue);
      if (result instanceof Promise) {
        throw new TypeError("Schema validation must be synchronous");
      }
      return transform(result, rootSchema);
    },
  };
}

export function createAsyncFormValueValidator<T extends StandardSchemaV1>(
  schema: T,
  options: FormValidatorOptions
): AsyncFormValueValidator<StandardSchemaV1.Issue> {
  const transform = createErrorsTransformer(options);
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const result = await schema["~standard"].validate(formValue);
      return transform(result, rootSchema);
    },
  };
}
