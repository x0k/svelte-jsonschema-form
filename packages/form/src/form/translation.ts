import type { Resolver } from "@/lib/resolver.js";
import type { FailedTask } from "@/lib/task.svelte.js";
import type { Schema } from "@/core/index.js";

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
  "unknown-field-error": { schema: Schema };
  "edit-optional-object": {};
  "clear-optional-object": {};
  "edit-optional-array": {};
  "clear-optional-array": {};
}

export type Label = keyof Labels;

export type Translator<Params> = string | ((params: Params) => string);

export type TranslatorDefinitions<R = Labels> = {
  [K in keyof R]: Translator<R[K]>;
};

export type Translation = Resolver<
  Partial<Labels>,
  Partial<TranslatorDefinitions<Labels>>
>;

export type Translate = <L extends Label>(
  label: L,
  params: Labels[L]
) => string;

export function createTranslate<Ls>(
  translation: Resolver<Partial<Ls>, Partial<TranslatorDefinitions<Ls>>>
) {
  return <L extends keyof Ls & string>(label: L, params: Ls[L]) => {
    const translator: Translator<Ls[L]> | undefined = translation(
      label,
      params
    );
    if (translator === undefined) {
      return `Label "${label}" is not translated`;
    }
    return typeof translator === "string" ? translator : translator(params);
  };
}
