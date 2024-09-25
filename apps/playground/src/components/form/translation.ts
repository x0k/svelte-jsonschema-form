import type { Get } from "@/lib/types";

export interface Labels {
  submit: [];
  "unsupported-field-type": [type: string];
  "array-schema-missing-items": [];
  yes: [];
  no: [];
}

export type Label = keyof Labels;

type SimpleLabels = {
  [L in Label]: Labels[L]["length"] extends 0 ? L : never;
};

export type SimpleLabel = SimpleLabels[keyof SimpleLabels];

export type Translation = <L extends Label>(
  label: L,
  ...params: Get<Labels, L, []>
) => string;

export function createTranslation(translations: {
  [L in Label]: string | ((...params: Get<Labels, L, []>) => string);
}): Translation {
  return (label, ...params) => {
    const translation = translations[label];
    return typeof translation === "string"
      ? translation
      : translation(...params);
  };
}
