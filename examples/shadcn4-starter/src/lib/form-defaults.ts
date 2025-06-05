export { resolver } from "@sjsf/form/resolvers/basic";

export { theme } from "@sjsf/shadcn4-theme";

export { translation } from "@sjsf/form/translations/en";

import { createFormValidator } from "@sjsf/ajv8-validator";

// NOTE: One validator will be used for all forms
export const validator = createFormValidator();