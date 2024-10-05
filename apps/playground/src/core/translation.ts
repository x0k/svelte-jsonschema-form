import type { Get } from "@/lib/types";

export interface Labels {
  submit: [];
  "unsupported-field-type": [type: string];
  "array-schema-missing-items": [];
  yes: [];
  no: [];
  "multi-schema-option-label-with-title": [title: string, index: number];
  "multi-schema-option-label": [index: number];
  "remove-object-property": []
  "add-object-property": []
  "remove-array-item": []
  "copy-array-item": []
  "move-array-item-up": []
  "move-array-item-down": []
  "add-array-item": []
}

export type Label = keyof Labels;

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
