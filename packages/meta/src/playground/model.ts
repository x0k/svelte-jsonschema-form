import { isRecord } from "@sjsf/form/lib/object";

import {
  codegemIsJsonSchemaValidator,
  codegenIsExternalValidator,
  codegenValidators,
} from "../codegen/index.ts";
import { resolvers, type Resolver } from "../form.ts";
import { iconSets, iconSetTitle } from "../icons.ts";
import { importModule } from "../modules.ts";
import {
  isLegacyTheme,
  isThemeWithSubThemes,
  themes,
  themeSubThemes,
} from "../themes.ts";
import type { Generated } from "../types.ts";
import { validatorTitle } from "../validators.ts";

// TODO: Remove in v4
/** @deprecated */
const DRAFT_2020_SUFFIX = `_2020`;

// TODO: Remove in v4
/** @deprecated */
type With2020Suffix<T extends string> = `${T}${typeof DRAFT_2020_SUFFIX}`;

// TODO: Remove in v4
/** @deprecated */
export function isEndsWith2020(v: string): v is With2020Suffix<string> {
  return v.endsWith(DRAFT_2020_SUFFIX);
}

// TODO: Remove in v4
/** @deprecated */
export function without2020Suffix<V extends string>(
  v: V | With2020Suffix<V>
): V {
  return isEndsWith2020(v) ? (v.slice(0, -DRAFT_2020_SUFFIX.length) as V) : v;
}

// TODO: Remove in v4
/** @deprecated */
export function* playgroundValidators() {
  for (const v of codegenValidators()) {
    if (!codegemIsJsonSchemaValidator(v) || v.precompiled) {
      continue;
    }
    yield v.draft2020 ? (`${v.name}${DRAFT_2020_SUFFIX}` as const) : v.name;
  }
}

// TODO: Remove in v4
/** @deprecated */
export type PlaygroundValidator1 = Generated<typeof playgroundValidators>;

export function* playgroundValidators2() {
  for (const v of codegenValidators()) {
    if ((v.draft2020 && v.precompiled) || !codegenIsExternalValidator(v)) {
      continue;
    }
    yield v;
  }
}

export type PlaygroundValidator2 = Generated<typeof playgroundValidators2>;

export type PlaygroundValidator = PlaygroundValidator1 | PlaygroundValidator2;

export function normalizeValidator(validator: PlaygroundValidator) {
  return typeof validator === "string"
    ? ({
        name: without2020Suffix(validator),
        draft2020: isEndsWith2020(validator),
        precompiled: false,
      } as const satisfies PlaygroundValidator2)
    : validator;
}

export function playgroundValidatorTitle(validator: PlaygroundValidator) {
  const v = normalizeValidator(validator);
  const title = validatorTitle(v.name);
  const suffix = v.draft2020 ? "2020-12" : v.precompiled ? "precompiled" : "";
  return `${title}${suffix && ` (${suffix})`}`;
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

export const EXPORT_DEFAULT = "export default";

export async function parseJsValue(str: string) {
  const code = str.includes(EXPORT_DEFAULT) ? str : `${EXPORT_DEFAULT} ${str}`;
  const m = await importModule<unknown>(code);
  if (!m || typeof m !== "object" || !("default" in m)) {
    return Promise.reject(new Error("Failed to parse"));
  }
  return m.default;
}

// TODO: Remove in v4
export async function parseJsRecord<S extends object>(str: string | S) {
  if (typeof str !== "string") {
    return str;
  }
  const value = await parseJsValue(str);
  if (!isRecord(value)) {
    throw new Error("Not a record");
  }
  return value as S;
}

// TODO: Remove in v4
export function normalizeJsonValue<S>(str: string | S) {
  return typeof str === "string" ? str : JSON.stringify(str, null, 2);
}

// TODO: Remove in v4
export type Normalize<T> = {
  [K in keyof T]: string extends T[K] ? string : T[K];
};
