import { createContext, type Component } from "svelte";
import type {
  Creatable,
  ExtraUiOptions,
  FormIdBuilder,
  FormMerger,
  FormState,
  FormValidator,
  Icons,
  IdBuilderFactoryOptions,
  MergerFactoryOptions,
  ResolveFieldType,
  Theme,
  Translation,
  ValidatorFactoryOptions,
} from "@sjsf/form";

interface Defaults {
  idPrefix: string;
  resolver: <T>(ctx: FormState<T>) => ResolveFieldType;
  theme: Theme;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: <T>(options: ValidatorFactoryOptions) => FormValidator<T>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  translation: Translation;
  icons: Icons | undefined;
  extraUiOptions: ExtraUiOptions;
}

export interface DemoContext {
  defaults: Defaults;
}

export interface DemoData {
  files: Record<string, string>;
  Component: Component;
}

const importRegExp = /import\s*(type)?\s*{.+?}\s*from\s+"@\/lib\/demo"/;
const contextRegExp = /const\s*{.+?}\s*=\s*getDemoContext\(\);?/;
const multiEmptyLinesRegExp = /\n\s*\n+/g;

export function cleanPage(content: string) {
  return content
    .replace(importRegExp, 'import * as defaults from "$lib/sjsf/defaults"')
    .replace(contextRegExp, "")
    .replaceAll(multiEmptyLinesRegExp, "\n\n");
}

export const [getDemoContext, setDemoContext] = createContext<DemoContext>();
