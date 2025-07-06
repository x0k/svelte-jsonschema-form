export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/boolean-select-include";

export { theme } from "@sjsf/shadcn4-theme";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";

export { translation } from "@sjsf/form/translations/en";

export { icons } from '@sjsf/lucide-icons'

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";

import { addJsonFormat } from "$lib/ajv.js";

export const validator = createFormValidator({
  ajvPlugins: (ajv) => addFormComponents(addJsonFormat(ajv)),
});
