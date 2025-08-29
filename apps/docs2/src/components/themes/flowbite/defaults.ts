export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";

export { theme } from "@sjsf/flowbite3-theme";
import "@sjsf/flowbite3-theme/extra-widgets/textarea-include";
import "@sjsf/flowbite3-theme/extra-widgets/checkboxes-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-include";
import "@sjsf/flowbite3-theme/extra-widgets/file-include";
import "@sjsf/flowbite3-theme/extra-widgets/date-picker-include";

import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

// required due to several forms on the page
export const idPrefix = "flowbite3";

export const validator = createFormValidator({
  idPrefix,
  ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
});
