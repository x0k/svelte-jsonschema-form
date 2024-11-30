import {
  Validator as CfValidator,
  type Schema as CfSchema,
} from "@cfworker/json-schema";

import type { Schema } from "@sjsf/form";

import {
  Validator,
  type CfValidatorFactory,
  type ValidatorOptions,
} from "./validator.svelte.js";

export function defaultFactory(schema: Schema): CfValidator {
  return new CfValidator(schema as CfSchema, "7", false);
}

type ValidatorFactoryOptions = Omit<ValidatorOptions, "factory"> & {
  factory?: CfValidatorFactory;
};

export function createValidator({
  factory = defaultFactory,
  ...rest
}: ValidatorFactoryOptions = {}) {
  return new Validator({
    ...rest,
    factory,
  });
}
