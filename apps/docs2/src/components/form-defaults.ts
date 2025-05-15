export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";

export { theme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/file-include";

export { translation } from "@sjsf/form/translations/en";

import { createFormValidator } from "@sjsf/ajv8-validator";

// NOTE: One validator will be used for all forms
export const validator = createFormValidator();
