export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";

export { theme } from "@sjsf/shadcn4-theme";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes-include";

import type {
  MergerFactoryOptions,
  Validator,
  ValidatorFactoryOptions,
} from "@sjsf/form";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

// required due to several forms on the page
export const idPrefix = "shadcn4";

export const createValidator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });

export const createMerger = <V extends Validator>({
  validator,
  schema,
}: MergerFactoryOptions<V>) => createFormMerger(validator, schema);

