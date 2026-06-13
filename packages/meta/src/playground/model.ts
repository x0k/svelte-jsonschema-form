import {
  codegemIsJsonSchemaValidator,
  codegenValidators,
} from "../codegen/index.ts";
import {
  isLegacyTheme,
  isThemeWithSubThemes,
  themes,
  themeSubThemes,
} from "../themes.ts";
import type { Generated } from "../types.ts";
import { validatorTitle } from "../validators.ts";
import { iconSets, iconSetTitle } from "../icons.ts";
import { resolvers, type Resolver } from "../form.ts";

const DRAFT_2020_SUFFIX = `_2020`;

type With2020Suffix<T extends string> = `${T}${typeof DRAFT_2020_SUFFIX}`;

export function isEndsWith2020(v: string): v is With2020Suffix<string> {
  return v.endsWith(DRAFT_2020_SUFFIX);
}

export function without2020Suffix<V extends string>(
  v: V | With2020Suffix<V>,
): V {
  return isEndsWith2020(v) ? (v.slice(0, -DRAFT_2020_SUFFIX.length) as V) : v;
}

export function* playgroundValidators() {
  for (const v of codegenValidators()) {
    if (!codegemIsJsonSchemaValidator(v) || v.precompiled) {
      continue;
    }
    yield v.draft2020 ? (`${v.name}${DRAFT_2020_SUFFIX}` as const) : v.name;
  }
}

export type PlaygroundValidator = Generated<typeof playgroundValidators>;

export function playgroundValidatorTitle(v: PlaygroundValidator) {
  const title = validatorTitle(without2020Suffix(v));
  return isEndsWith2020(v) ? `${title} (2020-12)` : title;
}

export function* playgroundThemes() {
  for (const t of themes()) {
    if (isLegacyTheme(t)) {
      continue;
    }
    yield t;
    if (isThemeWithSubThemes(t)) {
      yield* themeSubThemes(t);
    }
  }
}

export type PlaygroundTheme = Generated<typeof playgroundThemes>;

export function* playgroundIconSets() {
  yield "none";
  yield* iconSets();
}

export type PlaygroundIconSet = Generated<typeof playgroundIconSets>;

export function playgroundIconSetTitle(iconSet: PlaygroundIconSet) {
  return iconSet === "none" ? "None" : iconSetTitle(iconSet);
}

export type PlaygroundResolver = Resolver;

export const playgroundResolvers = resolvers;
