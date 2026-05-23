import type { SubTheme, Theme, ThemeOrSubTheme } from "../themes.ts";
import type { Generated } from "../types.ts";
import {
  externalValidatorPackage,
  isInternalValidator,
  isJsonSchemaValidator,
  isPrecompiledOnlyValidator,
  isSchemaValidator,
  validators,
} from "../validators.ts";
import {
  buildLayers,
  defineLayer,
  type Layer,
  type LayerFiles,
} from "./layer.ts";
import type { SchemaTransformer } from "./schema-transform.ts";

export enum Platform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
}

export const PLATFORMS = Object.values(Platform);

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
  AnimatedArray = "animated-array",
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

export type Example =
  | GenericExample
  | SvelteKitExample
  | ValidatorSpecificExample;

type ImportPromise<T> = Promise<{ default: T }>;

export const INITIAL_FILE = "src/routes/+page.svelte";

export const THEME_LAYERS: {
  [T in ThemeOrSubTheme]: () => ImportPromise<
    Layer<T extends SubTheme ? "basic" : T>
  >[];
} = {
  basic: () => [import("./layers/basic.ts")],
  pico: () => [import("./layers/pico.ts")],
  daisyui: () => [
    import("./layers/tailwind3.ts"),
    import("./layers/daisyui.ts"),
  ],
  daisyui5: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/daisyui5.ts"),
  ],
  flowbite: () => [
    import("./layers/tailwind3.ts"),
    import("./layers/flowbite.ts"),
  ],
  flowbite3: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/flowbite3.ts"),
  ],
  skeleton3: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/skeleton3.ts"),
  ],
  skeleton4: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/skeleton4.ts"),
  ],
  shadcn: () => [import("./layers/tailwind3.ts"), import("./layers/shadcn.ts")],
  shadcn4: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/shadcn4.ts"),
  ],
  "shadcn-extras": () => [
    import("./layers/tailwind4.ts"),
    import("./layers/shadcn-extras.ts"),
  ],
  svar: () => [import("./layers/svar.ts")],
  beercss: () => [import("./layers/beercss.ts")],
};

export const EXAMPLE_LAYERS: Record<
  Example,
  () => ImportPromise<Layer<any>>[]
> = {
  [GenericExample.Starter]: () => [import("./examples/starter.ts")],
  [GenericExample.AnimatedArray]: () => [
    import("./examples/animated-array.ts"),
  ],
  [GenericExample.MarkdownDescription]: () => [
    import("./examples/markdown-description.ts"),
  ],
  [GenericExample.DeprecatedKeyword]: () => [
    import("./examples/deprecated-keyword.ts"),
  ],
  [GenericExample.TabbedLayout]: () => [import("./examples/tabbed-layout.ts")],
  [GenericExample.RemoteEnum]: () => [import("./examples/remote-enum.ts")],
  [GenericExample.AsyncCombobox]: () => [
    import("./examples/async-combobox.ts"),
  ],
  [GenericExample.Formulas]: () => [import("./examples/formulas.ts")],
  [GenericExample.PatternPropertiesValidator]: () => [
    import("./examples/pattern-properties-validator.ts"),
  ],
  [GenericExample.DecomposedField]: () => [
    import("./examples/decomposed-field.ts"),
  ],
  [GenericExample.LayoutSlots]: () => [import("./examples/layout-slots.ts")],
  [GenericExample.PreuploadFile]: () => [
    import("./examples/preupload-file.ts"),
  ],
  [GenericExample.OptionalDataControls]: () => [
    import("./examples/optional-data-controls.ts"),
  ],
  [GenericExample.SchemaTransformation]: () => [
    import("./examples/schema-transformation.ts"),
  ],
  [GenericExample.LabelOnLeft]: () => [import("./examples/label-on-left.ts")],
  [GenericExample.Draft2020]: () => [import("./examples/draft-2020-12.ts")],
  [GenericExample.MultiStep]: () => [import("./examples/multi-step.ts")],
  [GenericExample.EnumWidgets]: () => [import("./examples/enum-widgets.ts")],
  [GenericExample.NullableFields]: () => [
    import("./examples/nullable-fields.ts"),
  ],
  [SvelteKitExample.FormActionsWithoutJs]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-without-js.ts"),
  ],
  [SvelteKitExample.MultiStepNativeForm]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/multi-step-native-form.ts"),
  ],
  [SvelteKitExample.FormActions]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions.ts"),
  ],
  [SvelteKitExample.FormActionsFlex]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-flex.ts"),
  ],
  [SvelteKitExample.FormActionsDynamicSchema]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-dynamic-schema.ts"),
  ],
  [SvelteKitExample.RemoteFunctions]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions.ts"),
  ],
  [SvelteKitExample.RemoteFunctionsEnhance]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-enhance.ts"),
  ],
  [SvelteKitExample.RemoteFunctionsDynamicSchema]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-dynamic-schema.ts"),
  ],
  [SvelteKitExample.RemoteFunctionsWithoutJs]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-without-js.ts"),
  ],
  [ValidatorSpecificExample.ZodStarter]: () => [
    import("./examples/zod-starter.ts"),
  ],
  [ValidatorSpecificExample.ValibotStarter]: () => [
    import("./examples/valibot-starter.ts"),
  ],
  [ValidatorSpecificExample.ArkTypeStarter]: () => [
    import("./examples/arktype-starter.ts"),
  ],
  [ValidatorSpecificExample.TypeBoxStarter]: () => [
    import("./examples/typebox-starter.ts"),
  ],
};

function* projectValidators() {
  for (const v of validators()) {
    if (
      (isJsonSchemaValidator(v) && !isPrecompiledOnlyValidator(v)) ||
      isSchemaValidator(v)
    ) {
      yield v;
    }
  }
}

export type ProjectValidator = Generated<typeof projectValidators>;

const SCHEMA_TRANSFORMERS: Partial<
  Record<ProjectValidator, () => ImportPromise<SchemaTransformer>>
> = {
  valibot: () => import("./schema-transformers/schema-to-valibot.ts"),
  zod4: () => import("./schema-transformers/schema-to-zod.ts"),
};

async function createValidatorLayer(validator: ProjectValidator) {
  const transform = await SCHEMA_TRANSFORMERS[validator]?.();
  const base = defineLayer({
    formDefaults: {
      validator,
    },
    codeTransformers: transform && [transform.default],
  });
  if (isInternalValidator(validator)) {
    return base;
  }
  const pkg = externalValidatorPackage(validator);
  return defineLayer({
    ...base,
    package: {
      dependencies: [pkg, ...pkg.dependencies],
    },
  });
}

function* projectValidatorPackages() {
  for (const v of projectValidators()) {
    yield [v, createValidatorLayer(v).then((l) => ({ default: l }))] as const;
  }
}

export const VALIDATOR_LAYERS = Object.fromEntries(
  projectValidatorPackages(),
) as Record<ProjectValidator, ImportPromise<Layer<any>>>;

export interface ProjectOptions {
  platform: Platform;
  example: Example;
  theme: Theme;
  validator: ProjectValidator;
}

export type OpenPlatformProject = (
  options: ProjectOptions,
  files: LayerFiles,
) => void;

export const PLATFORM_FACTORIES: Record<
  Platform,
  () => ImportPromise<OpenPlatformProject>
> = {
  [Platform.StackBlitz]: () => import("./platforms/stackblitz.ts"),
  [Platform.SvelteLab]: () => import("./platforms/svelte-lab.ts"),
};

export async function openProject(options: ProjectOptions) {
  const { example, theme, validator, platform } = options;
  const layers: Awaited<ImportPromise<Layer<any>>>[] = await Promise.all([
    import("./layers/sveltekit.ts"),
    ...THEME_LAYERS[theme](),
    VALIDATOR_LAYERS[validator],
    ...EXAMPLE_LAYERS[example](),
  ]);
  const files = buildLayers(layers.map((l) => l.default));
  const factory = await PLATFORM_FACTORIES[platform]();
  factory.default(options, files);
}
