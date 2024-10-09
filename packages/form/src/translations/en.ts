import { createTranslation } from "@/form/translation.js";

export const translation = createTranslation({
  submit: "Submit",
  "unsupported-field-type": (type) => `Unsupported field type: ${type}`,
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
});
