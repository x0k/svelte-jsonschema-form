import type { Resolver } from "@/lib/resolver.js";
import type { FailedAction } from "@/create-action.svelte.js";

export interface Labels {
  submit: {};
  "array-schema-missing-items": {};
  yes: {};
  no: {};
  "multi-schema-option-label-with-title": { title: string; index: number };
  "multi-schema-option-label": { index: number };
  "remove-object-property": {};
  "add-object-property": {};
  "remove-array-item": {};
  "copy-array-item": {};
  "move-array-item-up": {};
  "move-array-item-down": {};
  "add-array-item": {};
  "validation-process-error": { error: FailedAction<unknown> };
}

export type Label = keyof Labels;

export type Translator<L extends Label> =
  | string
  | ((params: Labels[L]) => string);

export type Translators = {
  [L in Label]: Translator<L>;
};

export type TranslatorResolver = Resolver<Labels, Translators, undefined>;

export type Translation = <L extends Label>(
  label: L,
  params: Labels[L]
) => string;

export function createTranslation(
  translatorResolver: TranslatorResolver
): Translation {
  return (label, params) => {
    const translation = translatorResolver(label, params);
    if (translation === undefined) {
      return `Label "${label}" is not translated`;
    }
    return typeof translation === "string" ? translation : translation(params);
  };
}
