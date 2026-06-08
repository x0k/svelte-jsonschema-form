import type { FieldsValidationMode, Schema, UiSchemaRoot } from "@sjsf/form";

import { iconSets } from "../icons.ts";
import type { Generated } from "../types.ts";
import {
  FIELD_VALIDATION_FLAGS,
  type FieldValidationFlag,
} from "../validation.generated.ts";
import {
  isInternalValidator,
  isJsonSchemaValidator,
  isPrecompiledOnlyValidator,
  isPrecompiledValidator,
  validators,
  type InternalValidator,
  type JsonSchemaValidator,
  type Validator,
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

export interface Draft2020<V extends boolean> {
  draft2020: V;
}

export interface Precompiled<V extends boolean> {
  precompiled: V;
}

export interface Name<V extends Validator> {
  name: V;
}

interface CodegenValidatorMeta
  extends Name<Validator>, Draft2020<boolean>, Precompiled<boolean> {}

function codegenValidator<const M extends CodegenValidatorMeta>(m: M) {
  return m;
}

export function* codegenValidators() {
  for (const name of validators()) {
    if (!isPrecompiledOnlyValidator(name)) {
      yield codegenValidator({
        name,
        draft2020: false,
        precompiled: false,
      });
    }
    if (isJsonSchemaValidator(name)) {
      if (!isPrecompiledOnlyValidator(name)) {
        yield codegenValidator({
          name,
          draft2020: true,
          precompiled: false,
        });
      }
      if (isPrecompiledValidator(name)) {
        yield codegenValidator({
          name,
          draft2020: false,
          precompiled: true,
        });
        yield codegenValidator({
          name,
          draft2020: true,
          precompiled: true,
        });
      }
    }
  }
}

export type CodegenValidator = Generated<typeof codegenValidators>;

export type CodegenNonPrecompiledValidator = Extract<
  CodegenValidator,
  Precompiled<false>
>;

export type CodegenPrecompiledValidator = Extract<
  CodegenValidator,
  Precompiled<true>
>;

export type Codegen2020Validator = Extract<CodegenValidator, Draft2020<true>>;

export function codegenIsExternalValidator<V extends CodegenValidatorMeta>(
  v: V,
): v is V & Name<Exclude<Validator, InternalValidator>> {
  return !isInternalValidator(v.name);
}

export function codegemIsJsonSchemaValidator<V extends CodegenValidatorMeta>(
  v: V,
): v is V & Name<JsonSchemaValidator> {
  return isJsonSchemaValidator(v.name);
}

export function* codegenIconSets() {
  yield "none";
  yield* iconSets();
}

export type CodegenIconSet = Generated<typeof codegenIconSets>;
