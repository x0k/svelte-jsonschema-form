export type { Schema, SchemaValue } from "@/core/index.js";

export * from "./component.js";
export * from "./fields/index.js";
export * from "./templates/index.js";
export * from "./widgets.js";
export * from "./theme.js";
export * from "./ui-schema.js";
export * from "./config.js";
export * from "./options.svelte.js";
export * from "./errors.js";
export * from "./validation.js";
export * from "./validator.js";
export * from "./id-schema.js";
export * from "./icons.js";
export * from "./get-default-form-state.js";

export { getFormContext, setFromContext } from "./context/index.js";
export type { FormContext } from "./context/index.js";
export {
  default as FormBase,
  type Props as FormProps,
} from "./form-base.svelte";
export { default as Form } from "./form.svelte";
