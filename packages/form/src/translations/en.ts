import { fromRecord } from '@/lib/resolver.js';
import type { Translators } from "@/form/translation.js";

const translators: Translators = {
  submit: "Submit",
  "array-schema-missing-items": "Missing items definition",
  yes: "Yes",
  no: "No",
  "multi-schema-option-label-with-title": (title, index) =>
    `${title} option ${index + 1}`,
  "multi-schema-option-label": (index) => `Option ${index + 1}`,
  "add-array-item": "Add item",
  "copy-array-item": "Copy",
  "add-object-property": "Add property",
  "move-array-item-down": "Down",
  "move-array-item-up": "Up",
  "remove-array-item": "Del",
  "remove-object-property": "Del",
};

export const translationResolver = fromRecord(translators)

// const FAILURE_REASONS: Record<ActionFailureReason, string> = {
//   "aborted": "Validation aborted",
//   "timeout": "Validation terminated by timeout",
//   "error": "Something went wrong during validation",
// }

// export function handleValidationProcessError (state: FailedAction<unknown>) {
//   return FAILURE_REASONS[state.reason]
// }
