import type { FormValueValidator, Validator } from "@sjsf/form";
import type { MaybePromise } from "@sjsf/form/lib/types";

import type { ExtraValidatorFactoryOptions } from "./validator-tests.js";

export function createPrecompiledValidatorFactory<T>(
  factory: (
    options: ExtraValidatorFactoryOptions,
  ) => MaybePromise<Validator & FormValueValidator<T>>,
) {
  return factory;
}
