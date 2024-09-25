import { createTranslation } from "@/components/form";

export const translation = createTranslation({
  submit: "Submit",
  "unsupported-field-type": (type) => `Unsupported field type: ${type}`,
  "array-schema-missing-items": "Missing items definition",
  yes: "Yes",
  no: "No",
});
