import type { AbstractPackage } from "../package.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import {
  codegenValidators,
  isEndsWithPrecompiled,
  type CodegenThemeOrSubTheme,
  type CodegenSvelteKitIntegration,
  type CodegenNonPrecompiledValidator,
} from "../codegen/index.ts";
import type { CodeTransformer } from "../composer/index.ts";
export { type Example, EXAMPLES } from "./example.generated.ts";

export enum Tag {
  /** Async data loading (remote sources, search) */
  Async = "async",
  /** Custom field/description components */
  CustomComponent = "custom component",
  /** Runtime schema changes */
  Dynamic = "dynamic",
  /** Enum/selection field handling */
  Enum = "enum",
  /** SvelteKit form actions integration */
  FormActions = "form actions",
  /** Form layout customization */
  Layout = "layout",
  /** Multi-step wizard forms */
  MultiStep = "multi step",
  /** Works without JavaScript */
  NoJs = "no js",
  /** SvelteKit remote functions integration */
  RemoteFunctions = "remote functions",
  /** Schema extension and manipulation */
  SchemaManipulation = "schema manipulation",
  /** Getting-started templates */
  Starter = "starter",
  /** SvelteKit integration */
  SvelteKit = "sveltekit",
  /** Different validator integrations */
  Validator = "validator",
}

export interface ExampleMetadata {
  title: string;
  description: string;
  tags: Tag[];
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
