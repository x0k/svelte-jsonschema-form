import { createContext, type Component } from "svelte";
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

export interface DemoContext {
  defaults: Defaults;
}

export interface DemoData {
  files: Record<string, string>;
  Component: Component;
}

const importRegExp =
  /\s*import\s*(type)?\s*{.+?}\s*from\s+"@\/lib\/demo";?\n?/g;
const contextRegExp = /const\s*{.+?}\s*=\s*getDemoContext\(\);?/;

export function cleanPage(content: string) {
  return content
    .replaceAll(importRegExp, "")
    .replace(contextRegExp, 'import * as defaults from "$lib/sjsf/defaults"');
}

export const [getDemoContext, setDemoContext] = createContext<DemoContext>();
