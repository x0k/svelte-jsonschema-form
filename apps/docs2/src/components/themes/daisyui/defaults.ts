export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/fields/extra/unknown-native-file-include";

export { theme } from "@sjsf/daisyui5-theme";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui5-theme/extra-widgets/checkboxes-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/file-include";
import "@sjsf/daisyui5-theme/extra-widgets/date-picker-include";

export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";

import type { ValidatorFactoryOptions } from "@sjsf/form";
import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

export const validator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });
