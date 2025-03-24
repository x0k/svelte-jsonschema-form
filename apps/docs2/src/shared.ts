import type { StarlightIcon } from "@astrojs/starlight/types";

export const THEMES = [
  "basic",
  "daisyui",
  "daisyui5",
  "flowbite",
  "skeleton3",
  "shadcn",
] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TITLES = {
  basic: "Basic",
  daisyui: "DaisyUI v4",
  daisyui5: "DaisyUI v5",
  flowbite: "Flowbite",
  skeleton3: "Skeleton v3",
  shadcn: "Shadcn",
} satisfies Record<Theme, string>;

export const THEME_PACKAGES = {
  basic: "@sjsf/basic-theme",
  daisyui: "@sjsf/daisyui-theme",
  daisyui5: "@sjsf/daisyui5-theme",
  flowbite: "@sjsf/flowbite-theme",
  skeleton3: "@sjsf/skeleton3-theme",
  shadcn: "@sjsf/shadcn-theme",
} satisfies Record<Theme, string>;

export function isTheme(str: string): str is Theme {
  return str in THEME_TITLES;
}

export const ICONS_PACKAGES = ["lucide", "moving", "flowbite", "radix"] as const;

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
