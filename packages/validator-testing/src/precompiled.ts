import type {
  FormValueValidator,
  Validator,
  ValidatorFactoryOptions,
} from "@sjsf/form";
import type { MaybePromise } from "@sjsf/form/lib/types";

export function createPrecompiledValidatorFactory<T>(
  factory: (
    options: ValidatorFactoryOptions,
  ) => MaybePromise<Validator & FormValueValidator<T>>,
) {
  return factory;
}
