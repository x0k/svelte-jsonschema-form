export { translation } from "@sjsf/form/translations/en";
export { resolver } from "@sjsf/form/resolvers/basic";

import { createFormValidator } from "@sjsf/ajv8-validator";

export const validator = createFormValidator();
