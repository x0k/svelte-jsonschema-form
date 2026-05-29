import type { StarlightIcon } from "@astrojs/starlight/types";
import {
  externalValidatorPackage,
  formPackage,
  isInternalValidator,
  isLabTheme,
  isLegacyTheme,
  isSubTheme,
  isTheme,
  isThemeExtension,
  isValidator,
  optionalPackageName,
  sveltekitPackage,
  themePackage,
  themeParent,
  themes,
  type Generated,
  type Package,
} from "meta";
import type { ImportPromise, Layer, ProjectValidator } from "meta/composer";

export function* actualThemes() {
  for (const t of themes()) {
    if (isLegacyTheme(t) || isThemeExtension(t) || isLabTheme(t)) {
      continue;
    }
    yield t;
  }
}

export type ActualTheme = Generated<typeof actualThemes>;

export const PKG_MANGERS = ["npm", "pnpm", "yarn", "bun", "deno"] as const;

export type PackageManager = (typeof PKG_MANGERS)[number];

export const PKG_MANGER_ICONS: Record<PackageManager, StarlightIcon> = {
  npm: "seti:npm",
  yarn: "seti:yarn",
  pnpm: "pnpm",
  bun: "bun",
  deno: "deno",
};

function getPackageByCodeName(n: string) {
  switch (true) {
    case n === "form":
      return formPackage;
    case n === "sveltekit":
      return sveltekitPackage;
    case isTheme(n):
      return themePackage(n);
    case isSubTheme(n):
      return themePackage(themeParent(n));
    case isValidator(n):
      return isInternalValidator(n) ? formPackage : externalValidatorPackage(n);
  }
}

export function isValidPackageCodeName(name: string) {
  return getPackageByCodeName(name) !== undefined;
}

export function getPackageMetadataByCodeName(pkgCodeName: string) {
  const pkg = getPackageByCodeName(pkgCodeName);
  if (!pkg) {
    throw new Error(`Unknown package: "${pkgCodeName}"`);
  }
  const unscoped =
    pkg.name[0] === "@" ? pkg.name.replace(/@.*?\//, "") : pkg.name;
  return {
    version: pkg.version,
    npmUrl: `https://www.npmjs.com/package/${pkg.name}`,
    npmxUrl: `https://npmx.dev/package/${pkg.name}`,
    githubUrl: `https://github.com/x0k/svelte-jsonschema-form/tree/main/${pkg.directory}`,
    changelogPath: `changelogs/${unscoped}`,
  };
}

const allowedOptionalDeps = new Set([
  optionalPackageName("cally"),
  optionalPackageName("internationalizedDate"),
  optionalPackageName("skeletonSvelte"),
]);

function* packageInstallPackages(pkg: Package) {
  yield pkg;
  for (const d of pkg.dependencies) {
    if (!d.optional || !allowedOptionalDeps.has(d.name)) {
      continue;
    }
    yield d;
  }
}

export function getPackageDependencies(pkg: Package) {
  return Array.from(packageInstallPackages(pkg))
    .map((p) => p.name)
    .join(" ");
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
  ProjectValidator
> = {
  [ValidatorSpecificExample.ZodStarter]: "zod4",
  [ValidatorSpecificExample.ValibotStarter]: "valibot",
  [ValidatorSpecificExample.ArkTypeStarter]: "standard-schema",
  [ValidatorSpecificExample.TypeBoxStarter]: "standard-schema",
};

export const VALIDATOR_SPECIFIC_EXAMPLES = Object.values(
  ValidatorSpecificExample
);

export type Example =
  | GenericExample
  | SvelteKitExample
  | ValidatorSpecificExample;

export const EXAMPLE_LAYERS: Record<
  Example,
  () => ImportPromise<Layer<any>>[]
> = {
  [GenericExample.Starter]: () => [import("./examples/starter.js")],
  [GenericExample.MarkdownDescription]: () => [
    import("./examples/markdown-description.js"),
  ],
  [GenericExample.DeprecatedKeyword]: () => [
    import("./examples/deprecated-keyword.js"),
  ],
  [GenericExample.TabbedLayout]: () => [import("./examples/tabbed-layout.js")],
  [GenericExample.RemoteEnum]: () => [import("./examples/remote-enum.js")],
  [GenericExample.AsyncCombobox]: () => [
    import("./examples/async-combobox.js"),
  ],
  [GenericExample.Formulas]: () => [import("./examples/formulas.js")],
  [GenericExample.PatternPropertiesValidator]: () => [
    import("./examples/pattern-properties-validator.js"),
  ],
  [GenericExample.DecomposedField]: () => [
    import("./examples/decomposed-field.js"),
  ],
  [GenericExample.LayoutSlots]: () => [import("./examples/layout-slots.js")],
  [GenericExample.PreuploadFile]: () => [
    import("./examples/preupload-file.js"),
  ],
  [GenericExample.OptionalDataControls]: () => [
    import("./examples/optional-data-controls.js"),
  ],
  [GenericExample.SchemaTransformation]: () => [
    import("./examples/schema-transformation.js"),
  ],
  [GenericExample.LabelOnLeft]: () => [import("./examples/label-on-left.js")],
  [GenericExample.Draft2020]: () => [import("./examples/draft-2020-12.js")],
  [GenericExample.MultiStep]: () => [import("./examples/multi-step.js")],
  [GenericExample.EnumWidgets]: () => [import("./examples/enum-widgets.js")],
  [GenericExample.NullableFields]: () => [
    import("./examples/nullable-fields.js"),
  ],
  [SvelteKitExample.FormActionsWithoutJs]: () => [
    // import("meta/composer/layers/form-actions"),
    import("./examples/form-actions-without-js.js"),
  ],
  [SvelteKitExample.MultiStepNativeForm]: () => [
    // import("meta/composer/layers/form-actions"),
    import("./examples/multi-step-native-form.js"),
  ],
  [SvelteKitExample.FormActions]: () => [
    // import("meta/composer/layers/form-actions"),
    import("./examples/form-actions.js"),
  ],
  [SvelteKitExample.FormActionsFlex]: () => [
    // import("meta/composer/layers/form-actions"),
    import("./examples/form-actions-flex.js"),
  ],
  [SvelteKitExample.FormActionsDynamicSchema]: () => [
    // import("meta/composer/layers/form-actions"),
    import("./examples/form-actions-dynamic-schema.js"),
  ],
  [SvelteKitExample.RemoteFunctions]: () => [
    // import("meta/composer/layers/remote-functions"),
    import("./examples/remote-functions.js"),
  ],
  [SvelteKitExample.RemoteFunctionsEnhance]: () => [
    // import("meta/composer/layers/remote-functions"),
    import("./examples/remote-functions-enhance.js"),
  ],
  [SvelteKitExample.RemoteFunctionsDynamicSchema]: () => [
    // import("meta/composer/layers/remote-functions"),
    import("./examples/remote-functions-dynamic-schema.js"),
  ],
  [SvelteKitExample.RemoteFunctionsWithoutJs]: () => [
    // import("meta/composer/layers/remote-functions"),
    import("./examples/remote-functions-without-js.js"),
  ],
  [ValidatorSpecificExample.ZodStarter]: () => [
    import("./examples/zod-starter.js"),
  ],
  [ValidatorSpecificExample.ValibotStarter]: () => [
    import("./examples/valibot-starter.js"),
  ],
  [ValidatorSpecificExample.ArkTypeStarter]: () => [
    import("./examples/arktype-starter.js"),
  ],
  [ValidatorSpecificExample.TypeBoxStarter]: () => [
    import("./examples/typebox-starter.js"),
  ],
};
