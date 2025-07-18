import type { Resolver } from "@/lib/resolver.js";
import type { FailedTask } from "@/lib/task.svelte.js";

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
  "validation-process-error": { error: FailedTask<unknown> };
  "component-not-found": { type: string };
  "key-input-title": { name: string };
  "additional-property": {};
}

export type Label = keyof Labels;

export type Translator<L extends Label> =
  | string
  | ((params: Labels[L]) => string);

export type TranslatorDefinitions = {
  [K in Label]: Translator<K>;
};

export type Translation = Resolver<
  Partial<Labels>,
  Partial<TranslatorDefinitions>
>;

export type Translate = <L extends Label>(
  label: L,
  params: Labels[L]
) => string;

export function createTranslate(translation: Translation) {
  return <L extends Label>(label: L, params: Labels[L]) => {
    const translator: Translator<L> | undefined = translation(label, params);
    if (translator === undefined) {
      return `Label "${label}" is not translated`;
    }
    return typeof translator === "string" ? translator : translator(params);
  };
}
