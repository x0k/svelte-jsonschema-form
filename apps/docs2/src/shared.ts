import type { StarlightIcon } from "@astrojs/starlight/types";

import { version } from "#/form/package.json";

export const VERSION = version;

export const FORM_PACKAGE = `@sjsf/form`;

export const AJV_PACKAGE_V = "ajv@8";

export const AJV_VALIDATOR_PACKAGE = `@sjsf/ajv8-validator`;

export const RESOLVERS = ["basic", "compat"] as const;

export type Resolver = (typeof RESOLVERS)[number];

export const VALIDATORS = ["ajv8", "cfworker", "schemasafe"] as const;

export type Validator = (typeof VALIDATORS)[number];

export const VALIDATOR_PACKAGES: Record<Validator, string> = {
  ajv8: "ajv",
  cfworker: "@cfworker/json-schema",
  schemasafe: "@exodus/schemasafe",
};

export const VALIDATOR_VERSIONS: Record<Validator, string> = {
  ajv8: "^8.17.0",
  cfworker: "^4.1.0",
  schemasafe: "^1.3.0",
};

export enum Example {
  Starter = "starter",
  AnimatedArray = "animated-array",
  MarkdownDescription = "markdown-description",
  TabbedLayout = "tabbed-layout",
  AsyncCombobox = "async-combobox",
  Formulas = "formulas",
  PatternPropertiesValidator = "pattern-properties-validator",
  NativeForm = "native-form",
}

export const EXAMPLES = Object.values(Example);

export const THEMES = [
  "basic",
  "daisyui",
  "daisyui5",
  "flowbite",
  "flowbite3",
  "skeleton",
  "skeleton3",
  "shadcn",
  "shadcn4",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEPRECATED_THEMES = [
  "daisyui",
  "flowbite",
  "skeleton",
  "shadcn",
] as const satisfies Theme[];

export const DEPRECATED_THEMES_SET = new Set<Theme>(DEPRECATED_THEMES);

export type DeprecatedTheme = (typeof DEPRECATED_THEMES)[number];

export const ACTUAL_THEMES = THEMES.filter(
  (t) => !DEPRECATED_THEMES_SET.has(t)
) as ActualTheme[];

export type ActualTheme = Exclude<Theme, DeprecatedTheme>;

export const THEME_TITLES = {
  basic: "basic",
  daisyui: "daisyUI v4",
  daisyui5: "daisyUI v5",
  flowbite: "Flowbite",
  flowbite3: "Flowbite v3",
  skeleton: "Skeleton v3 RC1",
  skeleton3: "Skeleton v3",
  shadcn: "shadcn-svelte",
  shadcn4: "shadcn-svelte",
} satisfies Record<Theme, string>;

export const THEME_BRAND = {
  basic: "",
  daisyui: "daisyUi",
  daisyui5: "daisyUI",
  flowbite: "Flowbite",
  flowbite3: "Flowbite",
  skeleton: "Skeleton",
  skeleton3: "Skeleton",
  shadcn: "shadcn-svelte",
  shadcn4: "shadcn-svelte",
} satisfies Record<Theme, string>;

export const THEME_PACKAGES = {
  basic: "@sjsf/basic-theme",
  daisyui: "@sjsf/daisyui-theme",
  daisyui5: "@sjsf/daisyui5-theme",
  flowbite: "@sjsf/flowbite-theme",
  flowbite3: "@sjsf/flowbite3-theme",
  skeleton: "@sjsf/skeleton-theme",
  skeleton3: "@sjsf/skeleton3-theme",
  shadcn: "@sjsf/shadcn-theme",
  shadcn4: "@sjsf/shadcn4-theme",
} satisfies Record<Theme, string>;

export function isTheme(str: string): str is Theme {
  return str in THEME_TITLES;
}

export function withTag(theme: Theme) {
  return THEME_PACKAGES[theme];
}

export function createThemeInstall(theme: Theme) {
  return `${FORM_PACKAGE} ${AJV_VALIDATOR_PACKAGE} ${AJV_PACKAGE_V} ${withTag(
    theme
  )}`;
}

export const ICONS_PACKAGES = [
  "lucide",
  "moving",
  "flowbite",
  "radix",
] as const;

export type IconsPackage = (typeof ICONS_PACKAGES)[number];

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
