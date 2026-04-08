import basicPackage from "@sjsf/basic-theme/package.json" with { type: "json" };
import daisyui5Package from "@sjsf/daisyui5-theme/package.json" with { type: "json" };
import flowbite3Package from "@sjsf/flowbite3-theme/package.json" with { type: "json" };
import skeleton4Package from "@sjsf/skeleton4-theme/package.json" with { type: "json" };
import shadcn4Package from "@sjsf/shadcn4-theme/package.json" with { type: "json" };
import shadcnExtrasPackage from "@sjsf-lab/shadcn-extras-theme/package.json" with { type: "json" };
import svarPackage from "@sjsf-lab/svar-theme/package.json" with { type: "json" };
import beercssPackage from "@sjsf-lab/beercss-theme/package.json" with { type: "json" };

import type { Package } from "./package.js";

export const ACTUAL_THEMES = [
  "basic",
  "daisyui5",
  "flowbite3",
  "skeleton4",
  "shadcn4",
] as const;

export type ActualTheme = (typeof ACTUAL_THEMES)[number];

export const LEGACY_THEMES = [
  "daisyui",
  "flowbite",
  "skeleton3",
  "shadcn",
] as const;

export type LegacyTheme = (typeof LEGACY_THEMES)[number];

export const LAB_THEMES = ["shadcn-extras", "svar", "beercss"] as const;

export type LabTheme = (typeof LAB_THEMES)[number];

const LAB_THEMES_SET = new Set<string>(LAB_THEMES);

export function isLabTheme(theme: string): theme is LabTheme {
  return LAB_THEMES_SET.has(theme);
}

export type Theme = ActualTheme | LegacyTheme | LabTheme;

export const THEME_SUB_THEMES = {
  basic: ["pico"],
} as const satisfies Partial<Record<Theme, string[]>>;

export const SUB_THEMES = Object.values(THEME_SUB_THEMES).flat();

const SUB_THEMES_SET = new Set<string>(SUB_THEMES);

export function isSubTheme(theme: string): theme is SubTheme {
  return SUB_THEMES_SET.has(theme);
}

const SUB_THEME_PARENTS: Map<SubTheme, Theme> = new Map();
for (const [parentTheme, subThemes] of Object.entries(THEME_SUB_THEMES)) {
  for (const subTheme of subThemes) {
    SUB_THEME_PARENTS.set(subTheme, parentTheme as Theme);
  }
}

export function getParentTheme(theme: SubTheme): Theme {
  return SUB_THEME_PARENTS.get(theme)!;
}

export type SubTheme = (typeof SUB_THEMES)[number];

export type ThemeOrSubTheme = Theme | SubTheme;

export type NonLegacyThemeOrSubTheme = Exclude<ThemeOrSubTheme, LegacyTheme>;

export type NonLegacyTheme = Exclude<NonLegacyThemeOrSubTheme, SubTheme>;

export const THEME_TITLES: Record<ThemeOrSubTheme, string> = {
  basic: "basic",
  pico: "pico",
  daisyui: "daisyUI v4",
  daisyui5: "daisyUI v5",
  flowbite: "Flowbite Svelte tw3",
  flowbite3: "Flowbite Svelte",
  skeleton3: "Skeleton v3",
  skeleton4: "Skeleton v4",
  shadcn: "shadcn-svelte tw3",
  shadcn4: "shadcn-svelte",
  "shadcn-extras": "shadcn-svelte-extras",
  svar: "SVAR",
  beercss: "Beer CSS",
};

export const THEME_BRAND = {
  basic: "",
  daisyui5: "daisyUI",
  flowbite3: "Flowbite",
  skeleton4: "Skeleton",
  shadcn4: "shadcn-svelte",
} satisfies Record<ActualTheme, string>;

export function themePackage(theme: ThemeOrSubTheme) {
  if (isSubTheme(theme)) {
    return themePackage(getParentTheme(theme));
  }
  return `@sjsf${isLabTheme(theme) ? "-lab" : ""}/${theme}-theme`;
}

const THEME_PACKAGES = {
  basic: basicPackage,
  daisyui5: daisyui5Package,
  flowbite3: flowbite3Package,
  skeleton4: skeleton4Package,
  shadcn4: shadcn4Package,
  "shadcn-extras": shadcnExtrasPackage,
  beercss: beercssPackage,
  svar: svarPackage,
} satisfies Record<NonLegacyTheme, Package>;
