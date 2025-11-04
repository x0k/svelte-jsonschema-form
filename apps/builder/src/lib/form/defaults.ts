import type { ValidatorFactoryOptions } from "@sjsf/form";

export { resolver } from "@sjsf/form/resolvers/basic";

export { theme } from "@sjsf/shadcn4-theme";

export { translation } from "@sjsf/form/translations/en";

export { icons } from "@sjsf/lucide-icons";

export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/legacy";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";

import { addBuilderFormats } from "$lib/ajv.js";

export const validator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addBuilderFormats(ajv)),
  });
