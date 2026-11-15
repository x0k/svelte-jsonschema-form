export { resolver } from "@sjsf/form/resolvers/basic";
export { defaultFormValueHandler as valueHandler } from "@sjsf/form/value-handlers/default";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

export { translation } from "@sjsf/form/translations/en";

export { createFormIdBuilder as idBuilder } from "@sjsf/sveltekit3";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";

export { createFormValidator as validator } from "@sjsf/ajv8-validator";
