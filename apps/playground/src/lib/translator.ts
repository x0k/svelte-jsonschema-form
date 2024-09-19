import type { Label, Translator } from "@/components/form/translation";

const translations: Record<Label, string> = {
  submit: "Submit",
};

export const enTranslator: Translator = (label) => translations[label];
