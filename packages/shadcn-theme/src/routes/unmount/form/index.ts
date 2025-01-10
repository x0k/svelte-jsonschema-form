import {
  DefaultMerger,
  defaultMerger,
  getDefaultFormState2,
  type Merger2,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@sjsf/form/core";

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

export type { Schema, SchemaValue } from "@sjsf/form/core";
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

export * from "./use-form.svelte.js";
export { default as FormContent } from "./form-content.svelte";
