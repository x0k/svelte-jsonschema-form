export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/unknown-native-file-include";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";

export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";

export { createFormValidator as validator } from "@sjsf/ajv8-validator";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";

export { translation } from "@sjsf/form/translations/en";
