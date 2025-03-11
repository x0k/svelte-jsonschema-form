import { fromRecord } from "@/lib/resolver.js";
import type { ActionFailureReason } from "@/lib/action.svelte.js";
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
  "validation-process-error": ({ error }) => FAILURE_REASONS[error.reason],
  "component-not-found": ({ type }) => `"${type}" component not found`,
  "key-input-title": ({ name }) => `${name} Key`,
};

const FAILURE_REASONS: Record<ActionFailureReason, string> = {
  aborted: "Validation aborted",
  timeout: "Validation terminated by timeout",
  error: "Something went wrong during validation",
};

export const translation = fromRecord(definitions);
