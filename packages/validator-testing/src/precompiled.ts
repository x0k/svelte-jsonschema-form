import type {
  FormValueValidator,
  Schema,
  Validator,
  ValidatorFactoryOptions,
} from "@sjsf/form";
import type { MaybePromise } from "@sjsf/form/lib/types";

export function createPrecompiledValidatorFactory<T>(
  factory: (options: ValidatorFactoryOptions) => MaybePromise<{
    validator: Validator & FormValueValidator<T>;
    rootSchema: Schema;
  }>,
) {
  return async (
    options: ValidatorFactoryOptions,
  ): Promise<Validator & FormValueValidator<T>> => {
    const { validator: v, rootSchema } = await factory(options);
    return {
      isValid(schema, _rootSchema, formValue) {
        return v.isValid(schema, rootSchema, formValue);
      },
      validateFormValue(_rootSchema, formValue) {
        return v.validateFormValue(rootSchema, formValue);
      },
    };
  };
}
