import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { Path, Schema } from "@/core/index.js";
import { getRootSchemaTitleByPath } from "@/form/model.js";
import { pathToId, type PathToIdOptions } from "@/form/id.js";
import { getUiSchemaByPath, type UiSchemaRoot } from "@/form/ui-schema.js";
import type {
  AsyncFormValueValidator,
  FormValueValidator,
  ValidationError,
} from "@/form/validator.js";

export interface ErrorsTransformerOptions extends PathToIdOptions {
  uiSchema?: UiSchemaRoot;
}

function issueToPath({ path }: StandardSchemaV1.Issue): Path {
  if (!path) {
    return [];
  }
  return path.map((val) => (typeof val === "object" ? val.key : val) as string);
}

function createErrorsTransformer(options: ErrorsTransformerOptions) {
  return <O>(
    { issues }: StandardSchemaV1.Result<O>,
    rootSchema: Schema
  ): ValidationError<StandardSchemaV1.Issue>[] => {
    if (!issues) {
      return [];
    }
    return issues.map((issue) => {
      const path = issueToPath(issue);
      const instanceId = pathToId(path, options);
      const propertyTitle =
        getUiSchemaByPath(options.uiSchema, path)?.["ui:options"]?.title ??
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

export interface FormValidatorOptions<T extends StandardSchemaV1>
  extends ErrorsTransformerOptions {
  schema: T;
}

export function createFormValueValidator<T extends StandardSchemaV1>(
  options: FormValidatorOptions<T>
): FormValueValidator<StandardSchemaV1.Issue> {
  const transform = createErrorsTransformer(options);
  return {
    validateFormValue(rootSchema, formValue) {
      const result = options.schema["~standard"].validate(formValue);
      if (result instanceof Promise) {
        throw new TypeError("Schema validation must be synchronous");
      }
      return transform(result, rootSchema);
    },
  };
}

export function createAsyncFormValueValidator<T extends StandardSchemaV1>(
  options: FormValidatorOptions<T>
): AsyncFormValueValidator<StandardSchemaV1.Issue> {
  const transform = createErrorsTransformer(options);
  return {
    async validateFormValueAsync(_, rootSchema, formValue) {
      const result = await options.schema["~standard"].validate(formValue);
      return transform(result, rootSchema);
    },
  };
}
