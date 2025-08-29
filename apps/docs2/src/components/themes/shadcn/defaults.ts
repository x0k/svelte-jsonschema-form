export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";

export { theme } from "@sjsf/shadcn4-theme";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";
import "@sjsf/shadcn4-theme/extra-widgets/file-include";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker-include";

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

// required due to several forms on the page
export const idPrefix = "shadcn4";

export const validator = createFormValidator({
  idPrefix,
  ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
});
