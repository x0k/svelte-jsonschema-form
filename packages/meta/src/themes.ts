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
import type { Tailwindcss4Plugin } from "./tailwindcss.ts";

const THEMES = [
  "basic",
  "daisyui5",
  "flowbite3",
  "skeleton4",
  "shadcn4",
  // Lab
  "shadcn-extras",
  "svar",
  "beercss",
  // Legacy
  "daisyui",
  "flowbite",
  "skeleton3",
  "shadcn",
] as const;

const THEMES_SET = new Set<string>(THEMES);

export type Theme = (typeof THEMES)[number];

const LEGACY_THEMES = [
  "daisyui",
  "flowbite",
  "skeleton3",
  "shadcn",
] satisfies Theme[];

const LEGACY_THEMES_SET = new Set<Theme>(LEGACY_THEMES);

export type LegacyTheme = (typeof LEGACY_THEMES)[number];

const LAB_THEMES = ["shadcn-extras", "svar", "beercss"] satisfies Theme[];

const LAB_THEMES_SET = new Set<Theme>(LAB_THEMES);

export type LabTheme = (typeof LAB_THEMES)[number];

const THEME_EXTENSION = ["shadcn-extras"] satisfies Theme[];

const THEME_EXTENSION_SET = new Set<Theme>(THEME_EXTENSION);

const THEME_EXTENSION_ORIGINS = {
  "shadcn-extras": "shadcn4",
} satisfies Record<ThemeExtension, Theme>;

export type ThemeExtension = (typeof THEME_EXTENSION)[number];

const TAILWINDCSS4_THEMES = [
  "daisyui5",
  "flowbite3",
  "shadcn4",
  "shadcn-extras",
  "skeleton4",
] satisfies Theme[];

const TAILWINDCSS4_THEMES_SET = new Set<Theme>(TAILWINDCSS4_THEMES);

export type Tailwindcss4Theme = (typeof TAILWINDCSS4_THEMES)[number];

const TAILWINDCSS4_THEME_PLUGINS = {
  skeleton4: ["forms"],
  "shadcn-extras": [],
  daisyui5: [],
  flowbite3: [],
  shadcn4: [],
} as const satisfies Record<Tailwindcss4Theme, Tailwindcss4Plugin[]>;

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

export type ActualTheme = Exclude<Theme, LegacyTheme | LabTheme>;

export type SubTheme = (typeof SUB_THEMES)[number];

export type ThemeWithSubThemes = keyof typeof THEME_SUB_THEMES;

export type ThemeOrSubTheme = Theme | SubTheme;

export type NonLegacyThemeOrSubTheme = Exclude<ThemeOrSubTheme, LegacyTheme>;

const THEME_OR_SUB_THEME_TITLES: Record<ThemeOrSubTheme, string> = {
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
  "shadcn-extras": ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("shadcn4").name}/dist`,
    },
    {
      name: "source",
      params: `${nodeModulesPath}/${themePackage("shadcn-extras").name}/dist`,
    },
  ],
};

export function themes(): Iterable<Theme> {
  return THEMES;
}

export function isTheme(theme: string): theme is Theme {
  return THEMES_SET.has(theme);
}

export function isLegacyTheme(theme: Theme): theme is LegacyTheme {
  return LEGACY_THEMES_SET.has(theme);
}

export function isThemeWithSubThemes(
  theme: Theme,
): theme is ThemeWithSubThemes {
  return theme in THEME_SUB_THEMES;
}

export function isLabTheme(theme: Theme): theme is LabTheme {
  return LAB_THEMES_SET.has(theme);
}

export function isThemeExtension(theme: Theme): theme is ThemeExtension {
  return THEME_EXTENSION_SET.has(theme);
}

export function themeExtensionOrigin(extension: ThemeExtension): Theme {
  return THEME_EXTENSION_ORIGINS[extension];
}

export function isTailwindcss4Theme(theme: Theme): theme is Tailwindcss4Theme {
  return TAILWINDCSS4_THEMES_SET.has(theme);
}

export function tailwindcss4ThemePlugins(
  theme: Tailwindcss4Theme,
): Iterable<Tailwindcss4Plugin> {
  return TAILWINDCSS4_THEME_PLUGINS[theme];
}

export function isSubTheme(theme: string): theme is SubTheme {
  return SUB_THEMES_SET.has(theme);
}

export function themeSubThemes(theme: ThemeWithSubThemes): Iterable<SubTheme> {
  return THEME_SUB_THEMES[theme];
}

export function themeParent(theme: SubTheme): Theme {
  return SUB_THEME_PARENTS.get(theme)!;
}

export function themeOrSubThemeTitle(theme: ThemeOrSubTheme): string {
  return THEME_OR_SUB_THEME_TITLES[theme];
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
