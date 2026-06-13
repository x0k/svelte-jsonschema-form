import type { CatalogMeta } from "../catalog.ts";
import type { AbstractPackage } from "../package.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import {
  codegenValidators,
  type CodegenThemeOrSubTheme,
  type CodegenSvelteKitIntegration,
} from "../codegen/index.ts";
import type { CodeTransformer, ComposerOptions } from "../composer/index.ts";
import type { Generated } from "../types.ts";

// NOTE: Order is important
export enum ExampleCategory {
  Starters = "Starters",
  LogicExtension = "Logic Extensions",
  UiExtension = "UI Extensions",
  SvelteKitIntegrations = "SvelteKit Integrations",
}

const ORDERED_CATEGORIES = Object.values(ExampleCategory);

export function exampleCategories(): Iterable<ExampleCategory> {
  return ORDERED_CATEGORIES;
}

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

export function* demosValidators() {
  for (const v of codegenValidators()) {
    if (v.draft2020 || v.precompiled) {
      continue;
    }
    yield v;
  }
}

export type DemosValidator = Generated<typeof demosValidators>;

export interface ExampleContent {
  files: Record<string, string>;
  dependencies: AbstractPackage[];
  codeTransformers: CodeTransformer[];
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<CodegenThemeOrSubTheme>][];
  validator: DemosValidator["name"];
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

export const COMPOSER_DEFAULTS = {
  modelName: "model",
  language: "ts",
  sveltekit: "no",
  focusOnFirstError: true,
  // These options are not relevant for demos,
  // because if they are used at all,
  // they are applied via `extraFiles`
  extraDependencies: [],
  codeTransformers: [],
  widgets: [],
  fields: [],
  fieldsValidationMode: 0,
  omitExtraData: false,
  disabled: false,
  merger: {},
  uiOptionsRegistry: {},
  uiSchema: {},
  themeExtension: [],
  moduleAugmentation: {},
  // inlined on demo page
  schema: undefined,
  initialValue: undefined,
} as const satisfies Partial<ComposerOptions<any>>;
