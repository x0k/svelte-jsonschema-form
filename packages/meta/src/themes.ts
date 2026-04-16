import basicPackage from "@sjsf/basic-theme/package.json" with { type: "json" };
import daisyui5Package from "@sjsf/daisyui5-theme/package.json" with { type: "json" };
import flowbite3Package from "@sjsf/flowbite3-theme/package.json" with { type: "json" };
import skeleton4Package from "@sjsf/skeleton4-theme/package.json" with { type: "json" };
import shadcn4Package from "@sjsf/shadcn4-theme/package.json" with { type: "json" };
// Lab
import shadcnExtrasPackage from "@sjsf-lab/shadcn-extras-theme/package.json" with { type: "json" };
import svarPackage from "@sjsf-lab/svar-theme/package.json" with { type: "json" };
import beercssPackage from "@sjsf-lab/beercss-theme/package.json" with { type: "json" };
// Legacy
import daisyuiPackage from "@sjsf/daisyui-theme/package.json" with { type: "json" };
import flowbitePackage from "@sjsf/flowbite-theme/package.json" with { type: "json" };
import skeleton3Package from "@sjsf/skeleton3-theme/package.json" with { type: "json" };
import shadcnPackage from "@sjsf/shadcn4-theme/package.json" with { type: "json" };

import {
  peerDependencies,
  type Package,
  type PeerDependenciesOptions,
} from "./package.js";

const ACTUAL_THEMES = [
  "basic",
  "daisyui5",
  "flowbite3",
  "skeleton4",
  "shadcn4",
] as const;

export type ActualTheme = (typeof ACTUAL_THEMES)[number];

const LEGACY_THEMES = ["daisyui", "flowbite", "skeleton3", "shadcn"] as const;

export type LegacyTheme = (typeof LEGACY_THEMES)[number];

const LAB_THEMES = ["shadcn-extras", "svar", "beercss"] as const;

export type LabTheme = (typeof LAB_THEMES)[number];

const LAB_THEMES_SET = new Set<string>(LAB_THEMES);

export type Theme = ActualTheme | LegacyTheme | LabTheme;

const THEME_SUB_THEMES = {
  basic: ["pico"],
} as const satisfies Partial<Record<Theme, string[]>>;

const SUB_THEMES = Object.values(THEME_SUB_THEMES).flat();

const SUB_THEMES_SET = new Set<string>(SUB_THEMES);

const SUB_THEME_PARENTS: Map<SubTheme, Theme> = new Map();
for (const [parentTheme, subThemes] of Object.entries(THEME_SUB_THEMES)) {
  for (const subTheme of subThemes) {
    SUB_THEME_PARENTS.set(subTheme, parentTheme as Theme);
  }
}

export type SubTheme = (typeof SUB_THEMES)[number];

export type ThemeOrSubTheme = Theme | SubTheme;

export type NonLegacyThemeOrSubTheme = Exclude<ThemeOrSubTheme, LegacyTheme>;

export type NonLegacyTheme = Exclude<NonLegacyThemeOrSubTheme, SubTheme>;

const NON_LEGACY_THEMES = [...ACTUAL_THEMES, ...LAB_THEMES] as const;

const NON_LEGACY_THEME_OR_SUB_THEMES: NonLegacyThemeOrSubTheme[] =
  NON_LEGACY_THEMES.slice();
for (let i = NON_LEGACY_THEME_OR_SUB_THEMES.length - 1; i >= 0; i--) {
  const t = NON_LEGACY_THEME_OR_SUB_THEMES[i]!;
  const subThemes =
    t in THEME_SUB_THEMES
      ? THEME_SUB_THEMES[t as keyof typeof THEME_SUB_THEMES]
      : undefined;
  if (subThemes) {
    NON_LEGACY_THEME_OR_SUB_THEMES.splice(i + 1, 0, ...subThemes);
  }
}

const THEME_TITLES: Record<ThemeOrSubTheme, string> = {
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

const THEME_BRAND = {
  basic: "",
  daisyui5: "daisyUI",
  flowbite3: "Flowbite",
  skeleton4: "Skeleton",
  shadcn4: "shadcn-svelte",
} satisfies Record<ActualTheme, string>;

const THEME_PACKAGES = {
  basic: basicPackage,
  daisyui5: daisyui5Package,
  flowbite3: flowbite3Package,
  skeleton4: skeleton4Package,
  shadcn4: shadcn4Package,
  "shadcn-extras": shadcnExtrasPackage,
  beercss: beercssPackage,
  svar: svarPackage,
  daisyui: daisyuiPackage,
  flowbite: flowbitePackage,
  shadcn: shadcnPackage,
  skeleton3: skeleton3Package,
} satisfies Record<Theme, Package>;

export function nonLegacyThemeOrSubThemes(): NonLegacyThemeOrSubTheme[] {
  return NON_LEGACY_THEME_OR_SUB_THEMES;
}

export function isLabTheme(theme: string): theme is LabTheme {
  return LAB_THEMES_SET.has(theme);
}

export function isSubTheme(theme: string): theme is SubTheme {
  return SUB_THEMES_SET.has(theme);
}

export function themeParent(theme: SubTheme): Theme {
  return SUB_THEME_PARENTS.get(theme)!;
}

export function themeTitle(theme: ThemeOrSubTheme): string {
  return THEME_TITLES[theme];
}

export function themeBrand(theme: ActualTheme): string {
  return THEME_BRAND[theme];
}

export function themePackage(theme: Theme): Package {
  return THEME_PACKAGES[theme];
}

export function themeDependencies(
  theme: Theme,
  options?: PeerDependenciesOptions,
) {
  return peerDependencies(THEME_PACKAGES[theme], options);
}
