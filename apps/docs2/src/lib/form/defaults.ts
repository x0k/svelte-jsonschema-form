import type { MergerFactoryOptions, Validator, ValidatorFactoryOptions } from "@sjsf/form";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/file-include";

export { translation } from "@sjsf/form/translations/en";

import { createFormMerger } from "@sjsf/form/mergers/modern";

import { createFormValidator } from "@sjsf/ajv8-validator";

export const createValidator = (options: ValidatorFactoryOptions) =>
  createFormValidator(options);

export const createMerger = <V extends Validator>({ validator, schema }: MergerFactoryOptions<V>) =>
  createFormMerger(validator, schema);
