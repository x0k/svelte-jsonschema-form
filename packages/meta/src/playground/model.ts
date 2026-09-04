import type { Schema } from "@sjsf/form";

import {
  codegenIsExternalValidator,
  codegenValidators,
} from "../codegen/index.ts";
import { resolvers, type Resolver } from "../form.ts";
import { iconSets, iconSetTitle } from "../icons.ts";
import {
  isLegacyTheme,
  isThemeWithSubThemes,
  themes,
  themeSubThemes,
} from "../themes.ts";
import type { Generated } from "../types.ts";
import { validatorTitle } from "../validators.ts";

export function* playgroundValidators2() {
  for (const v of codegenValidators()) {
    if (!codegenIsExternalValidator(v)) {
      continue;
    }
    yield v;
  }
}

export type PlaygroundValidator2 = Generated<typeof playgroundValidators2>;

export type PlaygroundValidator = PlaygroundValidator2;

export function playgroundValidatorTitle(validator: PlaygroundValidator) {
  const title = validatorTitle(validator.name);
  const suffixes: string[] = [];
  if (validator.precompiled) {
    suffixes.push("precompiled");
  }
  if (validator.draft2020) {
    suffixes.push("2020-12");
  }
  return `${title}${suffixes.length > 0 ? ` (${suffixes.join(", ")})` : ""}`;
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
  yield "skeleton4";
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

export function isDraft2020(schema: Schema) {
  return (
    schema.$schema?.startsWith(
      "https://json-schema.org/draft/2020-12/schema"
    ) ?? false
  );
}
