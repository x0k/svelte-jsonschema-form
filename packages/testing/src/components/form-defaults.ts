import type {
  MergerFactoryOptions,
  Validator,
  ValidatorFactoryOptions,
} from "@sjsf/form";
export { translation } from "@sjsf/form/translations/en";
export { resolver } from "@sjsf/form/resolvers/basic";
import { createFormValidator } from "@sjsf/ajv8-validator";
import { createFormMerger } from "@sjsf/form/mergers/modern";

export const createValidator = (options: ValidatorFactoryOptions): Validator =>
  createFormValidator(options);

export const createMerger = <V extends Validator>({
  schema,
  validator,
}: MergerFactoryOptions<V>) => createFormMerger(validator, schema);
