import type { StarlightIcon } from "@astrojs/starlight/types";

import { version } from "#/form/package.json";

// NOTE: Required for correct UiSchema augmentation
import "@sjsf/basic-theme";

export const VERSION = version;

export const IS_NEXT_VERSION = VERSION.includes("next");

export const FORM_PACKAGE = `@sjsf/form`;

export const AJV_PACKAGE_WITH_TAG = "ajv@8";

export const AJV_VALIDATOR_PACKAGE = `@sjsf/ajv8-validator`;

export const RESOLVERS = ["basic", "compat"] as const;

export type Resolver = (typeof RESOLVERS)[number];

export const VALIDATORS = [
  "Ajv",
  "@cfworker/json-schema",
  "@exodus/schemasafe",
  "Zod",
  "Valibot",
  "Standard Schema",
] as const;

export type Validator = (typeof VALIDATORS)[number];

export const JSON_SCHEMA_VALIDATORS: Validator[] = [
  "Ajv",
  "@cfworker/json-schema",
  "@exodus/schemasafe",
];

const VALIDATOR_TO_PACKAGE_PREFIX: Partial<Record<Validator, string>> = {
  Ajv: "ajv8",
  "@cfworker/json-schema": "cfworker",
  "@exodus/schemasafe": "schemasafe",
  Zod: "zod4",
  Valibot: "valibot",
};

export function validatorPackage(validator: Validator): string | undefined {
  const prefix = VALIDATOR_TO_PACKAGE_PREFIX[validator];
  return prefix && `@sjsf/${prefix}-validator`;
}

export const VALIDATOR_DEPENDENCIES: Record<
  Validator,
  Record<string, string>
> = {
  Ajv: { ajv: "^8.17.0" },
  "@cfworker/json-schema": {
    "@cfworker/json-schema": "^4.1.0",
  },
  "@exodus/schemasafe": {
    "@exodus/schemasafe": "^1.3.0",
  },
  Zod: { zod: "^4.1.0" },
  Valibot: {
    valibot: "^1.1.0",
    "@valibot/to-json-schema": "^1.3.0",
  },
  "Standard Schema": {},
};

export enum GenericExample {
  Starter = "starter",
  AnimatedArray = "animated-array",
  MarkdownDescription = "markdown-description",
  TabbedLayout = "tabbed-layout",
  AsyncCombobox = "async-combobox",
  Formulas = "formulas",
  PatternPropertiesValidator = "pattern-properties-validator",
  NativeForm = "native-form",
  DecomposedField = "decomposed-field",
  MultiStepNativeForm = "multi-step-native-form",
  LayoutSlots = "layout-slots",
  PreuploadFile = "preupload-file",
}

export const GENERIC_EXAMPLES = Object.values(GenericExample);

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

export type Example = GenericExample | ValidatorSpecificExample;

export const THEMES = [
  "basic",
  "daisyui5",
  "flowbite3",
  "skeleton3",
  "shadcn4",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEPRECATED_THEMES = [] as const satisfies Theme[];

export const DEPRECATED_THEMES_SET = new Set<Theme>(DEPRECATED_THEMES);

export type DeprecatedTheme = (typeof DEPRECATED_THEMES)[number];

export const ACTUAL_THEMES = THEMES.filter(
  (t) => !DEPRECATED_THEMES_SET.has(t)
) as ActualTheme[];

export type ActualTheme = Exclude<Theme, DeprecatedTheme>;

export const THEME_TITLES = {
  basic: "basic",
  daisyui5: "daisyUI v5",
  flowbite3: "Flowbite Svelte",
  skeleton3: "Skeleton v3",
  shadcn4: "shadcn-svelte",
} satisfies Record<Theme, string>;

export const THEME_BRAND = {
  basic: "",
  daisyui5: "daisyUI",
  flowbite3: "Flowbite",
  skeleton3: "Skeleton",
  shadcn4: "shadcn-svelte",
} satisfies Record<Theme, string>;

export const THEME_PACKAGES = {
  basic: "@sjsf/basic-theme",
  daisyui5: "@sjsf/daisyui5-theme",
  flowbite3: "@sjsf/flowbite3-theme",
  skeleton3: "@sjsf/skeleton3-theme",
  shadcn4: "@sjsf/shadcn4-theme",
} satisfies Record<Theme, string>;

export function isTheme(str: string): str is Theme {
  return str in THEME_TITLES;
}

export function pkg(val: string) {
  return IS_NEXT_VERSION && val.startsWith("@sjsf/") ? `${val}@next` : val;
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

export const PKG_MANGERS = ["npm", "yarn", "pnpm", "bun"] as const;

export type PackageManager = (typeof PKG_MANGERS)[number];

export const PKG_MANGER_ICONS: Record<PackageManager, StarlightIcon> = {
  npm: "seti:npm",
  yarn: "seti:yarn",
  pnpm: "pnpm",
  bun: "bun",
};
