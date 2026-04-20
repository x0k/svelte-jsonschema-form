import _basicPackageJson from "@sjsf/basic-theme/package.json" with { type: "json" };
import _daisyui5PackageJson from "@sjsf/daisyui5-theme/package.json" with { type: "json" };
import _flowbite3PackageJson from "@sjsf/flowbite3-theme/package.json" with { type: "json" };
import _skeleton4PackageJson from "@sjsf/skeleton4-theme/package.json" with { type: "json" };
import _shadcn4PackageJson from "@sjsf/shadcn4-theme/package.json" with { type: "json" };
// Lab
import _shadcnExtrasPackageJson from "@sjsf-lab/shadcn-extras-theme/package.json" with { type: "json" };
import _svarPackageJson from "@sjsf-lab/svar-theme/package.json" with { type: "json" };
import _beercssPackageJson from "@sjsf-lab/beercss-theme/package.json" with { type: "json" };
// Legacy
import _daisyuiPackageJson from "@sjsf/daisyui-theme/package.json" with { type: "json" };
import _flowbitePackageJson from "@sjsf/flowbite-theme/package.json" with { type: "json" };
import _skeleton3PackageJson from "@sjsf/skeleton3-theme/package.json" with { type: "json" };
import _shadcnPackageJson from "@sjsf/shadcn4-theme/package.json" with { type: "json" };

import {
  type Package,
  type PackageDependency,
  fromPackageJson,
} from "./package.ts";
import type { AtRule, AtRuleOptions } from "./css.ts";

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
  basic: "Basic",
  pico: "Pico",
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
  basic: fromPackageJson(_basicPackageJson),
  daisyui5: fromPackageJson(_daisyui5PackageJson),
  flowbite3: fromPackageJson(_flowbite3PackageJson),
  skeleton4: fromPackageJson(_skeleton4PackageJson),
  shadcn4: fromPackageJson(_shadcn4PackageJson),
  "shadcn-extras": fromPackageJson(_shadcnExtrasPackageJson),
  beercss: fromPackageJson(_beercssPackageJson),
  svar: fromPackageJson(_svarPackageJson),
  daisyui: fromPackageJson(_daisyuiPackageJson),
  flowbite: fromPackageJson(_flowbitePackageJson),
  shadcn: fromPackageJson(_shadcnPackageJson),
  skeleton3: fromPackageJson(_skeleton3PackageJson),
} satisfies Record<Theme, Package>;

const SUB_THEME_DEPENDENCIES: Record<SubTheme, PackageDependency[]> = {
  pico: [
    {
      name: "@picocss/pico",
      version: "^2.1.0",
      optional: false,
      dev: true,
    },
  ],
};

const THEME_OR_SUB_THEME_AT_RULES: Partial<
  Record<ThemeOrSubTheme, (options: AtRuleOptions) => AtRule[]>
> = {
  basic: () => [
    {
      name: "import",
      params: `${themePackage("basic").name}/css/basic.css`,
    },
  ],
  pico: () => [
    { name: "import", params: "@picocss/pico/css/pico.css" },
    { name: "import", params: `${themePackage("basic").name}/css/pico.css` },
  ],
  daisyui5: ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("daisyui5").name}/dist`,
    },
  ],
  flowbite3: ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("flowbite3").name}/dist`,
    },
  ],
  skeleton4: ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("skeleton4").name}/dist`,
    },
  ],
  shadcn4: ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("shadcn4").name}/dist`,
    },
  ],
};

export function nonLegacyThemes(): ReadonlyArray<NonLegacyTheme> {
  return NON_LEGACY_THEMES;
}

export function nonLegacyThemeOrSubThemes(): ReadonlyArray<NonLegacyThemeOrSubTheme> {
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

export function subThemeDependencies(
  subTheme: SubTheme,
): Iterable<PackageDependency> {
  return SUB_THEME_DEPENDENCIES[subTheme];
}

export function themeOrSubThemeAtRules(
  theme: ThemeOrSubTheme,
  options: AtRuleOptions,
) {
  return THEME_OR_SUB_THEME_AT_RULES[theme]?.(options) ?? [];
}
