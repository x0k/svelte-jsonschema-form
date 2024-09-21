import { createTranslation } from "@/components/form";

export const enTranslation = createTranslation({
  submit: "Submit",
  "unknown-field-type": (type) => `Unknown field type: ${type}`,
});
