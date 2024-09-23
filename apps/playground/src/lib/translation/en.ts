import { createTranslation } from "@/components/form";

export const translation = createTranslation({
  submit: "Submit",
  "unknown-field-type": (type) => `Unknown field type: ${type}`,
});
