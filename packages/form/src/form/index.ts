import {
  DefaultMerger,
  defaultMerger,
  getDefaultFormState2,
  type Merger2,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

/**
 * @deprecated Use `@sjsf/form/get-default-form-state` import instead
 */
export function getDefaultFormState(
  validator: Validator,
  schema: Schema,
  formData: SchemaValue | undefined = undefined,
  rootSchema = schema,
  merger: Merger2 = defaultMerger
) {
  return getDefaultFormState2(validator, merger, schema, formData, rootSchema);
}

export type { Schema, SchemaValue } from "@/core/index.js";
export { DefaultMerger };

export * from "./enum.js";
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
export * from "./merger.js";
export * from "./id-schema.js";
export * from "./icons.js";

export * from "./context/index.js";
export {
  default as FormBase,
  type Props as FormProps,
} from "./form-base.svelte";
export { default as Form } from "./form.svelte";

export * from "./create-form.svelte.js";
export { default as FormContent } from "./form-content.svelte";
export { default as SubmitButton } from "./submit-button.svelte";
export { default as SimpleForm } from "./simple-form.svelte";
