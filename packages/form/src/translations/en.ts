import { fromRecord } from "@/lib/resolver.js";
import type { TaskFailureReason } from "@/lib/task.svelte.js";
import type { TranslatorDefinitions } from "@/form/translation.js";

const definitions: TranslatorDefinitions = {
  submit: "Submit",
  "array-schema-missing-items": "Missing items definition",
  yes: "Yes",
  no: "No",
  "multi-schema-option-label-with-title": ({ title, index }) =>
    `${title} option ${index + 1}`,
  "multi-schema-option-label": ({ index }) => `Option ${index + 1}`,
  "add-array-item": "Add item",
  "copy-array-item": "Copy",
  "add-object-property": "Add property",
  "move-array-item-down": "Down",
  "move-array-item-up": "Up",
  "remove-array-item": "Del",
  "remove-object-property": "Del",
  "edit": "Edit",
  "clear": "Clear",
  "validation-process-error": ({ error }) => FAILURE_REASONS[error.reason],
  "component-not-found": ({ type }) => `"${type}" component not found`,
  "key-input-title": ({ name }) => `${name} Key`,
  "additional-property": "Additional property",
  "unknown-field-error": ({
    schema,
  }) => `You're seeing this error because your JSON Schema doesn’t contain enough information
to determine its type. You can:
- specify the schema type (for example, using the 'type' keyword)
- specify which component to use via UiSchema
  ('{ "ui:components": { "unknownField": "myField" } }')
- specify which component to use by providing a custom 'resolver'
  (https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/)

JSON Schema:
${JSON.stringify(schema, null, 2)}`,
};

const FAILURE_REASONS: Record<TaskFailureReason, string> = {
  aborted: "Validation aborted",
  timeout: "Validation terminated by timeout",
  error: "Something went wrong during validation",
};

export const translation = fromRecord(definitions);
