import { createTranslation } from "@/core";

export const translation = createTranslation({
  submit: "Submit",
  "unsupported-field-type": (type) => `Unsupported field type: ${type}`,
  "array-schema-missing-items": "Missing items definition",
  yes: "Yes",
  no: "No",
  "multi-schema-option-label-with-title": (title, index) => `${title} option ${index + 1}`,
  "multi-schema-option-label": (index) => `Option ${index + 1}`,
});
