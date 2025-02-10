import {
  DefaultMerger,
  defaultMerger,
  getDefaultFormState2,
  type Merger2,
  type Schema,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

export type { Schema, SchemaValue } from "@/core/index.js";
export { DefaultMerger };

export * from "./enum.js";
export * from "./theme.js";
export * from "./ui-schema.js";
export * from "./config.js";
export * from "./options.svelte.js";
export * from "./errors.js";
export * from "./validation.js";
export * from "./validator.js";
export * from "./merger.js";
export * from "./id.js";
export * from "./icons.js";

export * from "./context/index.js";

export * from "./create-form.svelte.js";
export { default as Content } from "./content.svelte";
export { default as SubmitButton } from "./submit-button.svelte";
export { default as FormElement } from "./form-element.svelte";
export { default as RawForm } from "./raw.svelte";
export { default as Form2 } from "./form2.svelte";
export { default as ErrorMessage, createMessage } from "./error-message.svelte";
export { default as Datalist } from "./datalist.svelte";
