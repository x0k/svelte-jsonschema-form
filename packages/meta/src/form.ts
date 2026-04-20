import _packageJson from "@sjsf/form/package.json" with { type: "json" };

import { fromPackageJson } from "./package.ts";

export const formPackage = fromPackageJson(_packageJson);

const ID_BUILDERS = ["legacy", "modern"] as const;

export type IdBuilder = (typeof ID_BUILDERS)[number];

export function formIdBuilderSubPath(idBuilder: IdBuilder) {
  return `${formPackage.name}/id-builders/${idBuilder}`;
}

const RESOLVERS = ["basic", "compat"] as const;

export type Resolver = (typeof RESOLVERS)[number];

export function formResolverSubPath(resolver: Resolver) {
  return `${formPackage.name}/resolvers/${resolver}`;
}

const TRANSLATIONS = ["en", "ru"] as const;

export type Translation = (typeof TRANSLATIONS)[number];

export function formTranslationSubPath(translation: Translation) {
  return `${formPackage.name}/translations/${translation}`;
}

const MERGERS = ["legacy", "modern"] as const;

export type Merger = (typeof MERGERS)[number];

export function formMergerSubPath(merger: Merger) {
  return `${formPackage.name}/mergers/${merger}`;
}
