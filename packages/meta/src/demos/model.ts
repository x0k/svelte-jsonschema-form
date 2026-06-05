import type { AbstractPackage } from "../package.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import {
  codegenValidators,
  isEndsWithPrecompiled,
  type CodegenThemeOrSubTheme,
  type CodegenValidator,
  type CodegenSvelteKitIntegration,
  type CodegenNonPrecompiledValidator,
} from "../codegen/index.ts";
import { createComposer, type CodeTransformer } from "../composer/index.ts";
import type { Example } from "./example.generated.ts";
export { type Example, EXAMPLES } from "./example.generated.ts";

export enum ExampleCategory {
  Generic = "generic",
  FormActions = "form-actions",
  RemoteFunctions = "remote-functions",
  ValidatorSpecific = "validator-specific",
}

export interface ExampleMetadata {
  title: string;
  description: string;
  category: ExampleCategory;
}

export interface ExampleContent {
  files: Record<string, string>;
  dependencies: AbstractPackage[];
  codeTransformers: CodeTransformer[];
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<CodegenThemeOrSubTheme>][];
  validator: CodegenNonPrecompiledValidator;
}

export function defineMeta(meta: ExampleMetadata) {
  return meta;
}

export function defineExample(c: Partial<ExampleContent>): ExampleContent {
  return {
    validator: "ajv8",
    files: {},
    dependencies: [],
    codeTransformers: [],
    sveltekit: "no",
    widgets: [],
    ...c,
  };
}

export const remoteFormDefaultsReplacer: CodeTransformer = (_filepath, code) =>
  code.replace("sjsf/remote-defaults", "sjsf/defaults");

export function* nonPrecompiledValidators() {
  for (const v of codegenValidators()) {
    if (!isEndsWithPrecompiled(v)) {
      yield v;
    }
  }
}
