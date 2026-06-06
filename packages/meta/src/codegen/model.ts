import type { FieldsValidationMode, Schema, UiSchemaRoot } from "@sjsf/form";

import { iconSets } from "../icons.ts";
import type { Generated } from "../types.ts";
import {
  FIELD_VALIDATION_FLAGS,
  type FieldValidationFlag,
} from "../validation.generated.ts";
import {
  isPrecompiledOnlyValidator,
  isPrecompiledValidator,
  validators,
} from "../validators.ts";
import {
  isLegacyTheme,
  isThemeWithSubThemes,
  themes,
  themeSubThemes,
} from "../themes.ts";

export type { FieldsValidationMode, Schema, UiSchemaRoot };

export function fieldsValidationModeFlags(
  mode: FieldsValidationMode,
): FieldValidationFlag[] {
  return (
    Object.entries(FIELD_VALIDATION_FLAGS) as [
      FieldValidationFlag,
      FieldsValidationMode,
    ][]
  )
    .filter(([, bit]) => mode & bit)
    .map(([name]) => name);
}

export type Language = "ts" | "js";

export type ConditionalPrinter = (content: string, alt?: string) => string;

export function createPrinter(condition: boolean): ConditionalPrinter {
  return (content: string, alt = "") => (condition ? content : alt);
}

export type PathFactory = (path: string) => string;

export function* codegenThemeOrSubTheme() {
  for (const t of themes()) {
    if (isLegacyTheme(t)) {
      continue;
    }
    yield t;
    if (isThemeWithSubThemes(t)) {
      for (const s of themeSubThemes(t)) {
        yield s;
      }
    }
  }
}

export type CodegenThemeOrSubTheme = Generated<typeof codegenThemeOrSubTheme>;

export function* codegenSvelteKitIntegrations() {
  yield "no";
  yield "formActions";
  yield "remoteFunctions";
}

export type CodegenSvelteKitIntegration = Generated<
  typeof codegenSvelteKitIntegrations
>;

const PRECOMPILED_SUFFIX = `_precompiled`;

type WithPrecompiledSuffix<T extends string> =
  `${T}${typeof PRECOMPILED_SUFFIX}`;

export function isEndsWithPrecompiled(
  v: string,
): v is WithPrecompiledSuffix<string> {
  return v.endsWith(PRECOMPILED_SUFFIX);
}

export function withoutPrecompiledSuffix<V extends string>(
  v: V | WithPrecompiledSuffix<V>,
): V {
  return isEndsWithPrecompiled(v)
    ? (v.slice(0, -PRECOMPILED_SUFFIX.length) as V)
    : v;
}

export function* codegenValidators() {
  for (const v of validators()) {
    if (!isPrecompiledOnlyValidator(v)) {
      yield v;
    }
    if (isPrecompiledValidator(v)) {
      yield `${v}${PRECOMPILED_SUFFIX}` as const;
    }
  }
}

export type CodegenValidator = Generated<typeof codegenValidators>;

export type CodegenNonPrecompiledValidator = Exclude<
  CodegenValidator,
  WithPrecompiledSuffix<string>
>;

export type CodegenPrecompiledValidator = Extract<
  CodegenValidator,
  WithPrecompiledSuffix<string>
>;

export function* codegenIconSets() {
  yield "none";
  yield* iconSets();
}

export type CodegenIconSet = Generated<typeof codegenIconSets>;
