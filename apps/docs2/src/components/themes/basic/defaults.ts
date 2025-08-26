export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";

export { createFormMerger as createMerger } from "@sjsf/form/mergers/modern";

import type { ValidatorFactoryOptions } from "@sjsf/form";
import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

export const createValidator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });
