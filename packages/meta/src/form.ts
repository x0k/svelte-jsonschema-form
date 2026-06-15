import _packageJson from "@sjsf/form/package.json" with { type: "json" };

import { fromPackageJson } from "./package.ts";

export const formPackage = fromPackageJson(_packageJson);

export const formCoreSubpath = `${formPackage.name}/core`;

const _ID_BUILDERS = ["legacy", "modern"] as const;

export type IdBuilder = (typeof _ID_BUILDERS)[number];

export function formIdBuilderSubPath(idBuilder: IdBuilder) {
  return `${formPackage.name}/id-builders/${idBuilder}`;
}

const RESOLVERS = ["basic", "compat"] as const;

export type Resolver = (typeof RESOLVERS)[number];

export function resolvers(): Iterable<Resolver> {
  return RESOLVERS;
}

export function formResolverSubPath(resolver: Resolver) {
  return `${formPackage.name}/resolvers/${resolver}`;
}

const _TRANSLATIONS = ["en", "ru"] as const;

export type Translation = (typeof _TRANSLATIONS)[number];

export function formTranslationSubPath(translation: Translation) {
  return `${formPackage.name}/translations/${translation}`;
}

const _MERGERS = ["legacy", "modern"] as const;

export type Merger = (typeof _MERGERS)[number];

export function formMergerSubPath(merger: Merger) {
  return `${formPackage.name}/mergers/${merger}`;
}

const _UTILS = [
  "focus-on-first-error",
  "omit-extra-data",
  "options.svelte",
  "prevent-page-reload.svelte",
] as const;

export type FormUtil = (typeof _UTILS)[number];

export function formUtilSubPath(util: FormUtil) {
  return `${formPackage.name}/${util}`;
}
