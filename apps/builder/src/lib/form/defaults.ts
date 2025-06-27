export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";

import { extendByRecord } from "@sjsf/form/lib/resolver";
import { theme as base } from "@sjsf/shadcn4-theme";
import Stepper from "./stepper-widget.svelte";

export const theme = extendByRecord(base, {
  myStepperWidget: Stepper,
});

export { translation } from "@sjsf/form/translations/en";

import { createFormValidator } from "@sjsf/ajv8-validator";

export const validator = createFormValidator();
