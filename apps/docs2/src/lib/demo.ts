import type { Component } from "svelte";
import type {
  Creatable,
  FormIdBuilder,
  FormMerger,
  FormState,
  FormValidator,
  IdBuilderFactoryOptions,
  MergerFactoryOptions,
  ResolveFieldType,
  Theme,
  Translation,
  ValidatorFactoryOptions,
} from "@sjsf/form";

interface Defaults {
  resolver: <T>(ctx: FormState<T>) => ResolveFieldType;
  theme: Theme;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: <T>(options: ValidatorFactoryOptions) => FormValidator<T>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  translation: Translation;
}

export interface DemoProps {
  defaults: Defaults;
}

export interface DemoData {
  files: Record<string, string>;
  Component: Component<DemoProps> | Component;
}

const importRegExp = /import\s*(type)?\s*{.+?}\s*from\s+"@\/lib\/demo"/;
const propsRegExp = /\s*const\s*{.+?}\s*:\s*DemoProps\s*=\s*\$props\(\);?/;

export function cleanPage(content: string) {
  return content
    .replace(importRegExp, 'import * as defaults from "$lib/sjsf/defaults"')
    .replace(propsRegExp, "");
}
