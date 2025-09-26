import type { ValidatorFactoryOptions } from "@sjsf/form";

export { resolver } from "@sjsf/form/resolvers/basic";

export { theme } from "@sjsf/shadcn4-theme";

export { translation } from "@sjsf/form/translations/en";

export { icons } from "@sjsf/lucide-icons";

import { createFormIdBuilder as createIdBuilder } from "@sjsf/form/id-builders/legacy";
export { createIdBuilder };

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
export { createFormMerger as createMerger } from "@sjsf/form/mergers/modern";

export const createValidator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addBuilderFormats(ajv)),
  });

import { addBuilderFormats } from "$lib/ajv.js";

export const validator = createFormValidator({
  idBuilder: createIdBuilder(),
  uiSchema: {},
  ajvPlugins: (ajv) => addFormComponents(addBuilderFormats(ajv)),
});
