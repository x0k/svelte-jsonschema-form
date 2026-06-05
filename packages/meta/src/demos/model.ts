import type { CatalogMeta } from "../catalog.ts";
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

export enum ExampleCategory {
  GettingStarted = "Getting Started",
  SvelteKitIntegrations = "SvelteKit Integrations",
  SchemaAndValidation = "Schema & Validation",
  LayoutAndComponents = "Layout & Components",
}

export function exampleCategories(): Iterable<ExampleCategory> {
  return ORDERED_CATEGORIES;
}

const ORDERED_CATEGORIES = Object.values(ExampleCategory);

export enum Tag {
  /** Custom field/description components */
  CustomComponent = "custom component",
  /** Enum/selection field handling */
  Enum = "enum",
  /** SvelteKit form actions integration */
  FormActions = "form actions",
  /** Custom form layout */
  Layout = "layout",
  /** Works without JavaScript */
  NoJs = "no js",
  /** SvelteKit remote functions integration */
  RemoteFunctions = "remote functions",
  /** Schema version/feature usage */
  Schema = "schema",
}

export type ExampleMetadata = CatalogMeta<ExampleCategory, Tag> & {
  isValidatorSpecific?: boolean;
};

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
