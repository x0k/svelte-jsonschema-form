import type { StarlightIcon } from "@astrojs/starlight/types";
import type { AbstractPackage, Theme } from "meta";

import { version } from "pkgs/form/package.json";

// NOTE: Required for correct UiSchema augmentation
import "@sjsf/basic-theme";

export const VERSION = version;

export const IS_NEXT_VERSION = VERSION.includes("next");

export const FORM_PACKAGE = "@sjsf/form";
export const FORM_SVELTEKIT_PACKAGE = "@sjsf/sveltekit";
export const FORM_SVELTEKIT_RF_PACKAGE = "@sjsf/sveltekit/rf";

export const AJV_PACKAGE_WITH_TAG = "ajv@8";

export const AJV_VALIDATOR_PACKAGE = `@sjsf/ajv8-validator`;

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

export const VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS: Record<
  ValidatorSpecificExample,
  Validator
> = {
  [ValidatorSpecificExample.ZodStarter]: "Zod",
  [ValidatorSpecificExample.ValibotStarter]: "Valibot",
  [ValidatorSpecificExample.ArkTypeStarter]: "Standard Schema",
  [ValidatorSpecificExample.TypeBoxStarter]: "Standard Schema",
};

export const VALIDATOR_SPECIFIC_EXAMPLES = Object.values(
  ValidatorSpecificExample
);

export type Example =
  | GenericExample
  | SvelteKitExample
  | ValidatorSpecificExample;

export function pkg(val: string) {
  return IS_NEXT_VERSION && val.startsWith("@sjsf") ? `${val}@next` : val;
}

export function packages(str: string) {
  return str.split(/\s+/).map(pkg).join(" ");
}

export function themePkg(theme: Theme) {
  return THEME_PACKAGES[theme];
}

export function createThemeInstall(theme: Theme) {
  return `${FORM_PACKAGE} ${AJV_VALIDATOR_PACKAGE} ${AJV_PACKAGE_WITH_TAG} ${
    THEME_PACKAGES[theme]
  }`;
}

export const ICONS_PACKAGES = [
  "lucide",
  "moving",
  "flowbite",
  "radix",
] as const;

export type IconsPackage = (typeof ICONS_PACKAGES)[number];

export function iconsPkg(icons: IconsPackage) {
  return ICONS_PACKAGE_NAMES[icons];
}

export const ICONS_PACKAGE_NAMES = {
  flowbite: "@sjsf/flowbite-icons",
  lucide: "@sjsf/lucide-icons",
  moving: "@sjsf/moving-icons",
  radix: "@sjsf/radix-icons",
} satisfies Record<IconsPackage, string>;

export const ICONS_PACKAGE_TITLES = {
  flowbite: "Flowbite",
  lucide: "Lucide",
  moving: "Moving",
  radix: "Radix",
} satisfies Record<IconsPackage, string>;

export const PKG_MANGERS = ["npm", "pnpm", "yarn", "bun", "deno"] as const;

export type PackageManager = (typeof PKG_MANGERS)[number];

export const PKG_MANGER_ICONS: Record<PackageManager, StarlightIcon> = {
  npm: "seti:npm",
  yarn: "seti:yarn",
  pnpm: "pnpm",
  bun: "bun",
  deno: "deno",
};

const packagesMeta = Object.values(
  import.meta.glob(
    ["pkgs/*/package.json", "legacy/*/package.json", "lab/*/package.json"],
    {
      import: "default",
      eager: true,
    }
  )
) as {
  name: string;
  version: string;
  repository: {
    directory: string;
  };
}[];

const packagesMap = new Map(packagesMeta.map((p) => [p.name, p]));

export function isValidPackageName(name: string) {
  return packagesMap.has(name);
}

export function getPackageMetadata(pkg: AbstractPackage) {
  const unscoped =
    pkg.name[0] === "@" ? pkg.name.replace(/@.*?\//, "") : pkg.name;
  return {
    version: pkg.version,
    npmUrl: `https://www.npmjs.com/package/${pkg.name}`,
    githubUrl: `https://github.com/x0k/svelte-jsonschema-form/tree/main/${pkg.repository.directory}`,
    changelogPath: `changelogs/${unscoped}`,
  };
}
