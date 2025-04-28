import type { Resolver } from "@/lib/resolver.js";
import type { FailedAction } from "@/lib/action.svelte.js";

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
