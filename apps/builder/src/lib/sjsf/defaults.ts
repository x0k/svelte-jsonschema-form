import type { ValidatorFactoryOptions } from "@sjsf/form";
import { createLogger } from "@sjsf/form/loggers/once";
import { PLAYGROUND_SJSF_THEMES } from "meta/playground";

export { resolver } from "@sjsf/form/resolvers/basic";
export { defaultFormValueHandler as valueHandler } from "@sjsf/form/value-handlers/default";

export const theme = PLAYGROUND_SJSF_THEMES["shadcn4"];

export { translation } from "@sjsf/form/translations/en";

export { icons } from "@sjsf/lucide-icons";

export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/legacy";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
export const logger = createLogger();

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";

import { addBuilderFormats } from "$lib/ajv.js";

export const validator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addBuilderFormats(ajv)),
  });
