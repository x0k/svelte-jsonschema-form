export { resolver } from "@sjsf/form/resolvers/basic";

export { theme } from "@sjsf/shadcn4-theme";

export { translation } from "@sjsf/form/translations/en";

export { icons } from "@sjsf/lucide-icons";

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";

import { addBuilderFormats } from "$lib/ajv.js";

export const validator = createFormValidator({
  ajvPlugins: (ajv) => addFormComponents(addBuilderFormats(ajv)),
});
