import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { Path } from "@/core/index.js";
import type {
  AsyncFormValueValidator,
  FormValueValidator,
  ValidationError,
} from "@/form/main.js";

function issueToPath({ path }: StandardSchemaV1.Issue): Path {
  if (!path) {
    return [];
  }
  return path.map((val) => (typeof val === "object" ? val.key : val) as string);
}

function transformErrors<O>({
  issues,
}: StandardSchemaV1.Result<O>): ValidationError[] {
  if (!issues) {
    return [];
  }
  return issues.map((issue) => ({
    path: issueToPath(issue),
    message: issue.message,
  }));
}

export function createFormValueValidator<T extends StandardSchemaV1>(
  schema: T
): FormValueValidator {
  return {
    validateFormValue(_, formValue) {
      const result = schema["~standard"].validate(formValue);
      if (result instanceof Promise) {
        throw new TypeError("Schema validation must be synchronous");
      }
      return transformErrors(result);
    },
  };
}

export function createAsyncFormValueValidator<T extends StandardSchemaV1>(
  schema: T
): AsyncFormValueValidator {
  return {
    async validateFormValueAsync(_, _1, formValue) {
      const result = await schema["~standard"].validate(formValue);
      return transformErrors(result);
    },
  };
}
