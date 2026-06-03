import type { AbstractPackage } from "../package.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";
import type { ToTheme } from "../themes.ts";
import {
  codegenValidators,
  isEndsWithPrecompiled,
  type CodegenThemeOrSubTheme,
  type CodegenValidator,
  type CodegenSvelteKitIntegration,
} from "../codegen/index.ts";
import { createComposer, type CodeTransformer } from "../composer/index.ts";

export interface ExampleContent {
  files: Record<string, string>;
  dependencies: AbstractPackage[];
  codeTransformers: CodeTransformer[];
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<CodegenThemeOrSubTheme>][];
}

export function defineExample(c: Partial<ExampleContent>): ExampleContent {
  return {
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

export enum GenericExample {
  Starter = "starter",
  MarkdownDescription = "markdown-description",
  DeprecatedKeyword = "deprecated-keyword",
  TabbedLayout = "tabbed-layout",
  RemoteEnum = "remote-enum",
  AsyncCombobox = "async-combobox",
  Formulas = "formulas",
  PatternPropertiesValidator = "pattern-properties-validator",
  DecomposedField = "decomposed-field",
  LayoutSlots = "layout-slots",
  PreuploadFile = "preupload-file",
  OptionalDataControls = "optional-data-controls",
  SchemaTransformation = "schema-transformation",
  LabelOnLeft = "label-on-left",
  Draft2020 = "draft-2020-12",
  MultiStep = "multi-step",
  EnumWidgets = "enum-widgets",
  NullableFields = "nullable-fields",
}

export const GENERIC_EXAMPLES = Object.values(GenericExample);

export enum SvelteKitExample {
  FormActions = "form-actions",
  FormActionsFlex = "form-actions-flex",
  FormActionsWithoutJs = "form-actions-without-js",
  FormActionsDynamicSchema = "form-actions-dynamic-schema",
  RemoteFunctions = "remote-functions",
  RemoteFunctionsEnhance = "remote-functions-enhance",
  RemoteFunctionsWithoutJs = "remote-functions-without-js",
  RemoteFunctionsDynamicSchema = "remote-functions-dynamic-schema",
  MultiStepNativeForm = "multi-step-native-form",
}

export const SVELTE_KIT_EXAMPLES = Object.values(SvelteKitExample);

export enum ValidatorSpecificExample {
  ZodStarter = "zod-starter",
  ValibotStarter = "valibot-starter",
  ArkTypeStarter = "arktype-starter",
  TypeBoxStarter = "typebox-starter",
}

export const VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS: Record<
  ValidatorSpecificExample,
  CodegenValidator
> = {
  [ValidatorSpecificExample.ZodStarter]: "zod4",
  [ValidatorSpecificExample.ValibotStarter]: "valibot",
  [ValidatorSpecificExample.ArkTypeStarter]: "standard-schema",
  [ValidatorSpecificExample.TypeBoxStarter]: "standard-schema",
};

export const VALIDATOR_SPECIFIC_EXAMPLES = Object.values(
  ValidatorSpecificExample,
);

const VALIDATOR_SPECIFIC_EXAMPLES_SET = new Set<Example>(
  VALIDATOR_SPECIFIC_EXAMPLES,
);

export type Example =
  | GenericExample
  | SvelteKitExample
  | ValidatorSpecificExample;

export const EXAMPLE_LAYERS: Record<
  Example,
  () => Promise<{ default: ExampleContent }>
> = {
  [GenericExample.Starter]: () => import("./examples/starter.ts"),
  [GenericExample.MarkdownDescription]: () =>
    import("./examples/markdown-description.ts"),
  [GenericExample.DeprecatedKeyword]: () =>
    import("./examples/deprecated-keyword.ts"),
  [GenericExample.TabbedLayout]: () => import("./examples/tabbed-layout.ts"),
  [GenericExample.RemoteEnum]: () => import("./examples/remote-enum.ts"),
  [GenericExample.AsyncCombobox]: () => import("./examples/async-combobox.ts"),
  [GenericExample.Formulas]: () => import("./examples/formulas.ts"),
  [GenericExample.PatternPropertiesValidator]: () =>
    import("./examples/pattern-properties-validator.ts"),
  [GenericExample.DecomposedField]: () =>
    import("./examples/decomposed-field.ts"),
  [GenericExample.LayoutSlots]: () => import("./examples/layout-slots.ts"),
  [GenericExample.PreuploadFile]: () => import("./examples/preupload-file.ts"),
  [GenericExample.OptionalDataControls]: () =>
    import("./examples/optional-data-controls.ts"),
  [GenericExample.SchemaTransformation]: () =>
    import("./examples/schema-transformation.ts"),
  [GenericExample.LabelOnLeft]: () => import("./examples/label-on-left.ts"),
  [GenericExample.Draft2020]: () => import("./examples/draft-2020-12.ts"),
  [GenericExample.MultiStep]: () => import("./examples/multi-step.ts"),
  [GenericExample.EnumWidgets]: () => import("./examples/enum-widgets.ts"),
  [GenericExample.NullableFields]: () =>
    import("./examples/nullable-fields.ts"),
  [SvelteKitExample.FormActionsWithoutJs]: () =>
    import("./examples/form-actions-without-js.ts"),
  [SvelteKitExample.MultiStepNativeForm]: () =>
    import("./examples/multi-step-native-form.ts"),
  [SvelteKitExample.FormActions]: () => import("./examples/form-actions.ts"),
  [SvelteKitExample.FormActionsFlex]: () =>
    import("./examples/form-actions-flex.ts"),
  [SvelteKitExample.FormActionsDynamicSchema]: () =>
    import("./examples/form-actions-dynamic-schema.ts"),
  [SvelteKitExample.RemoteFunctions]: () =>
    import("./examples/remote-functions.ts"),
  [SvelteKitExample.RemoteFunctionsEnhance]: () =>
    import("./examples/remote-functions-enhance.ts"),
  [SvelteKitExample.RemoteFunctionsDynamicSchema]: () =>
    import("./examples/remote-functions-dynamic-schema.ts"),
  [SvelteKitExample.RemoteFunctionsWithoutJs]: () =>
    import("./examples/remote-functions-without-js.ts"),
  [ValidatorSpecificExample.ZodStarter]: () =>
    import("./examples/zod-starter.ts"),
  [ValidatorSpecificExample.ValibotStarter]: () =>
    import("./examples/valibot-starter.ts"),
  [ValidatorSpecificExample.ArkTypeStarter]: () =>
    import("./examples/arktype-starter.ts"),
  [ValidatorSpecificExample.TypeBoxStarter]: () =>
    import("./examples/typebox-starter.ts"),
};

export const VALIDATOR_TRANSFORMERS: Partial<
  Record<CodegenValidator, () => Promise<{ default: CodeTransformer }>>
> = {
  zod4: () => import("./schema-transformers/schema-to-zod.ts"),
  valibot: () => import("./schema-transformers/schema-to-valibot.ts"),
};

export interface CreateExampleFilesOptions {
  example: Example;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenValidator;
}

export async function createExampleFiles(
  options: CreateExampleFilesOptions,
): Promise<Record<string, string>> {
  const { example, themeOrSubTheme, validator } = options;
  const { default: content } = await EXAMPLE_LAYERS[example]();

  const codeTransformers: CodeTransformer[] = [...content.codeTransformers];

  if (!VALIDATOR_SPECIFIC_EXAMPLES_SET.has(example)) {
    const transformers = VALIDATOR_TRANSFORMERS[validator]?.();
    if (transformers) {
      codeTransformers.push((await transformers).default);
    }
  }

  return createComposer({
    name: example,
    language: "ts",
    icons: "none",
    themeOrSubTheme,
    validatorWithSuffix: validator,
    sveltekit: content.sveltekit,
    widgets: content.widgets,
    extraFiles: content.files,
    extraDependencies: content.dependencies,
    codeTransformers,
  });
}
