export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";

export { theme } from "@sjsf/daisyui5-theme";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include";

export { translation } from "@sjsf/form/translations/en";

import { createFormValidator } from "@sjsf/cfworker-validator";

// NOTE: One validator will be used for all forms
export const validator = createFormValidator();