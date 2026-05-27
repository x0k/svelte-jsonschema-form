import { playgroundThemes } from "../playground/index.ts";
import type { SubTheme } from "../themes.ts";
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

export enum ProjectPlatform {
  StackBlitz = "StackBlitz",
  SvelteLab = "SvelteLab",
}

export const PROJECT_PLATFORMS = Object.values(ProjectPlatform);

export enum ProjectGenericExample {
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

export const PROJECT_GENERIC_EXAMPLES = Object.values(ProjectGenericExample);

export enum ProjectSvelteKitExample {
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

export const PROJECT_SVELTE_KIT_EXAMPLES = Object.values(
  ProjectSvelteKitExample,
);

export enum ProjectValidatorSpecificExample {
  ZodStarter = "zod-starter",
  ValibotStarter = "valibot-starter",
  ArkTypeStarter = "arktype-starter",
  TypeBoxStarter = "typebox-starter",
}

export const PROJECT_VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS: Record<
  ProjectValidatorSpecificExample,
  ProjectValidator
> = {
  [ProjectValidatorSpecificExample.ZodStarter]: "zod4",
  [ProjectValidatorSpecificExample.ValibotStarter]: "valibot",
  [ProjectValidatorSpecificExample.ArkTypeStarter]: "standard-schema",
  [ProjectValidatorSpecificExample.TypeBoxStarter]: "standard-schema",
};

export const PROJECT_VALIDATOR_SPECIFIC_EXAMPLES = Object.values(
  ProjectValidatorSpecificExample,
);

export type ProjectExample =
  | ProjectGenericExample
  | ProjectSvelteKitExample
  | ProjectValidatorSpecificExample;

type ImportPromise<T> = Promise<{ default: T }>;

export const INITIAL_FILE = "src/routes/+page.svelte";

export const THEME_LAYERS: {
  [T in ProjectTheme]: () => ImportPromise<
    Layer<T extends SubTheme ? "basic" : T>
  >[];
} = {
  basic: () => [import("./layers/basic.ts")],
  pico: () => [import("./layers/pico.ts")],
  daisyui5: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/daisyui5.ts"),
  ],
  flowbite3: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/flowbite3.ts"),
  ],
  skeleton4: () => [
    import("./layers/tailwind4.ts"),
    import("./layers/skeleton4.ts"),
  ],
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
  ProjectExample,
  () => ImportPromise<Layer<any>>[]
> = {
  [ProjectGenericExample.Starter]: () => [import("./examples/starter.ts")],
  [ProjectGenericExample.MarkdownDescription]: () => [
    import("./examples/markdown-description.ts"),
  ],
  [ProjectGenericExample.DeprecatedKeyword]: () => [
    import("./examples/deprecated-keyword.ts"),
  ],
  [ProjectGenericExample.TabbedLayout]: () => [
    import("./examples/tabbed-layout.ts"),
  ],
  [ProjectGenericExample.RemoteEnum]: () => [
    import("./examples/remote-enum.ts"),
  ],
  [ProjectGenericExample.AsyncCombobox]: () => [
    import("./examples/async-combobox.ts"),
  ],
  [ProjectGenericExample.Formulas]: () => [import("./examples/formulas.ts")],
  [ProjectGenericExample.PatternPropertiesValidator]: () => [
    import("./examples/pattern-properties-validator.ts"),
  ],
  [ProjectGenericExample.DecomposedField]: () => [
    import("./examples/decomposed-field.ts"),
  ],
  [ProjectGenericExample.LayoutSlots]: () => [
    import("./examples/layout-slots.ts"),
  ],
  [ProjectGenericExample.PreuploadFile]: () => [
    import("./examples/preupload-file.ts"),
  ],
  [ProjectGenericExample.OptionalDataControls]: () => [
    import("./examples/optional-data-controls.ts"),
  ],
  [ProjectGenericExample.SchemaTransformation]: () => [
    import("./examples/schema-transformation.ts"),
  ],
  [ProjectGenericExample.LabelOnLeft]: () => [
    import("./examples/label-on-left.ts"),
  ],
  [ProjectGenericExample.Draft2020]: () => [
    import("./examples/draft-2020-12.ts"),
  ],
  [ProjectGenericExample.MultiStep]: () => [import("./examples/multi-step.ts")],
  [ProjectGenericExample.EnumWidgets]: () => [
    import("./examples/enum-widgets.ts"),
  ],
  [ProjectGenericExample.NullableFields]: () => [
    import("./examples/nullable-fields.ts"),
  ],
  [ProjectSvelteKitExample.FormActionsWithoutJs]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-without-js.ts"),
  ],
  [ProjectSvelteKitExample.MultiStepNativeForm]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/multi-step-native-form.ts"),
  ],
  [ProjectSvelteKitExample.FormActions]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions.ts"),
  ],
  [ProjectSvelteKitExample.FormActionsFlex]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-flex.ts"),
  ],
  [ProjectSvelteKitExample.FormActionsDynamicSchema]: () => [
    import("./layers/form-actions.ts"),
    import("./examples/form-actions-dynamic-schema.ts"),
  ],
  [ProjectSvelteKitExample.RemoteFunctions]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions.ts"),
  ],
  [ProjectSvelteKitExample.RemoteFunctionsEnhance]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-enhance.ts"),
  ],
  [ProjectSvelteKitExample.RemoteFunctionsDynamicSchema]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-dynamic-schema.ts"),
  ],
  [ProjectSvelteKitExample.RemoteFunctionsWithoutJs]: () => [
    import("./layers/remote-functions.ts"),
    import("./examples/remote-functions-without-js.ts"),
  ],
  [ProjectValidatorSpecificExample.ZodStarter]: () => [
    import("./examples/zod-starter.ts"),
  ],
  [ProjectValidatorSpecificExample.ValibotStarter]: () => [
    import("./examples/valibot-starter.ts"),
  ],
  [ProjectValidatorSpecificExample.ArkTypeStarter]: () => [
    import("./examples/arktype-starter.ts"),
  ],
  [ProjectValidatorSpecificExample.TypeBoxStarter]: () => [
    import("./examples/typebox-starter.ts"),
  ],
};

export function* projectValidators() {
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

export const projectThemes = playgroundThemes;

export type ProjectTheme = Generated<typeof projectThemes>;

export interface ProjectOptions {
  platform: ProjectPlatform;
  example: ProjectExample;
  theme: ProjectTheme;
  validator: ProjectValidator;
}

export type OpenPlatformProject = (
  options: ProjectOptions,
  files: LayerFiles,
) => void;

export const PLATFORM_FACTORIES: Record<
  ProjectPlatform,
  () => ImportPromise<OpenPlatformProject>
> = {
  [ProjectPlatform.StackBlitz]: () => import("./platforms/stackblitz.ts"),
  [ProjectPlatform.SvelteLab]: () => import("./platforms/svelte-lab.ts"),
};

export async function projectOpen(options: ProjectOptions) {
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
