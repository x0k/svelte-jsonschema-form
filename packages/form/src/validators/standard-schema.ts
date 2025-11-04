import type { StandardSchemaV1 } from "@standard-schema/spec";

import type { Path } from "@/core/index.js";
import type {
  AsyncFormValueValidator,
  FormValue,
  FormValueValidator,
  ValidationResult,
} from "@/form/main.js";

function issueToPath({ path }: StandardSchemaV1.Issue): Path {
  if (!path) {
    return [];
  }
  return path.map((val) => (typeof val === "object" ? val.key : val) as string);
}

function transformErrors<O>(
  formValue: FormValue,
  result: StandardSchemaV1.Result<O>
): ValidationResult<O> {
  if (result.issues === undefined) {
    return {
      value: result.value,
    };
  }
  return {
    value: formValue,
    errors: result.issues.map((issue) => ({
      path: issueToPath(issue),
      message: issue.message,
    })),
  };
}

export function createFormValueValidator<T extends StandardSchemaV1>(
  schema: T
): FormValueValidator<StandardSchemaV1.InferOutput<T>> {
  return {
    validateFormValue(_, formValue) {
      const result = schema["~standard"].validate(formValue);
      if (result instanceof Promise) {
        throw new TypeError("Schema validation must be synchronous");
      }
      return transformErrors(formValue, result);
    },
  };
}

export function createAsyncFormValueValidator<T extends StandardSchemaV1>(
  schema: T
): AsyncFormValueValidator<StandardSchemaV1.InferOutput<T>> {
  return {
    async validateFormValueAsync(_, _1, formValue) {
      const result = await schema["~standard"].validate(formValue);
      return transformErrors(formValue, result);
    },
  };
}
