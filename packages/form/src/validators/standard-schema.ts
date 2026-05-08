import type {
  StandardJSONSchemaV1,
  StandardSchemaV1,
} from "@standard-schema/spec";

import type {
  Validator,
  Schema,
  Path,
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

function isValid(schema: Schema): boolean {
  throw new Error(
    `Method 'isValid' is not implemented for "${JSON.stringify(schema)}"`
  );
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

export function createFormValidator<T extends StandardSchemaV1>(schema: T) {
  return Object.assign({ isValid }, createFormValueValidator(schema));
}

export function createAsyncFormValidator<T extends StandardSchemaV1>(
  schema: T
) {
  return Object.assign({ isValid }, createAsyncFormValueValidator(schema));
}

interface CombinedProps<Input = unknown, Output = Input>
  extends
    StandardSchemaV1.Props<Input, Output>,
    StandardJSONSchemaV1.Props<Input, Output> {}

interface CombinedSpec<Input = unknown, Output = Input> {
  "~standard": CombinedProps<Input, Output>;
}

interface AdapterResult<V extends (...args: any) => any> {
  schema: Schema;
  validator: Validator & ReturnType<V>;
}

export function adapt<T extends CombinedSpec>(
  combined: T
): AdapterResult<typeof createFormValueValidator<T>>;
export function adapt<V extends StandardSchemaV1>(
  validator: V,
  schema: StandardJSONSchemaV1<StandardSchemaV1.InferInput<V>, any>
): AdapterResult<typeof createFormValueValidator<V>>;
export function adapt<V extends CombinedSpec | StandardSchemaV1>(
  validator: V,
  schema = validator as StandardJSONSchemaV1
): AdapterResult<typeof createFormValueValidator<V>> {
  return {
    schema: schema["~standard"].jsonSchema.input({
      target: "draft-07",
    }),
    validator: createFormValidator(validator),
  };
}

export function adaptAsync<T extends CombinedSpec>(
  combined: T
): AdapterResult<typeof createAsyncFormValueValidator<T>>;
export function adaptAsync<V extends StandardSchemaV1>(
  validator: V,
  schema: StandardJSONSchemaV1<StandardSchemaV1.InferInput<V>, any>
): AdapterResult<typeof createAsyncFormValueValidator<V>>;
export function adaptAsync<V extends CombinedSpec | StandardSchemaV1>(
  validator: V,
  schema = validator as StandardJSONSchemaV1
): AdapterResult<typeof createAsyncFormValueValidator<V>> {
  return {
    schema: schema["~standard"].jsonSchema.input({
      target: "draft-07",
    }),
    validator: createAsyncFormValidator(validator),
  };
}
