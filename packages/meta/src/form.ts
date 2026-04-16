import packageJson from "@sjsf/form/package.json" with { type: "json" };

import type { Package } from "./package.js";

export function formPackage(): Package {
  return packageJson;
}

export function formPackageName() {
  return packageJson.name;
}

const ID_BUILDERS = ["legacy", "modern"] as const;

export type IdBuilder = (typeof ID_BUILDERS)[number];

export function formIdBuilderSubPath(idBuilder: IdBuilder) {
  return `${packageJson.name}/id-builders/${idBuilder}`;
}

const RESOLVERS = ["basic", "compat"] as const;

export type Resolver = (typeof RESOLVERS)[number];

export function formResolverSubPath(resolver: Resolver) {
  return `${packageJson.name}/resolvers/${resolver}`;
}

const TRANSLATIONS = ["en", "ru"] as const;

export type Translation = (typeof TRANSLATIONS)[number];

export function formTranslationSubPath(translation: Translation) {
  return `${packageJson.name}/translations/${translation}`;
}

const MERGERS = ["legacy", "modern"] as const;

export type Merger = (typeof MERGERS)[number];

export function formMergerSubPath(merger: Merger) {
  return `${packageJson.name}/mergers/${merger}`;
}
