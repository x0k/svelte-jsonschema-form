import { createTranslation } from "@/components/form";

export const translation = createTranslation({
  submit: "Submit",
  "unsupported-field-type": (type) => `Unsupported field type: ${type}`,
  yes: "Yes",
  no: "No",
});
