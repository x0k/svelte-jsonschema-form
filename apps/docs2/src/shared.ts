import type { StarlightIcon } from '@astrojs/starlight/types';

export const THEMES = [
  "basic",
  "daisyui",
  "daisyui5",
  "flowbite",
  "skeleton",
  "shadcn",
] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TITLES = {
  basic: "Basic",
  daisyui: "DaisyUI v4",
  daisyui5: "DaisyUI v5",
  flowbite: "Flowbite",
  skeleton: "Skeleton",
  shadcn: "Shadcn",
} satisfies Record<Theme, string>;

export const THEME_PACKAGES = {
  basic: "@sjsf/basic-theme",
  daisyui: "@sjsf/daisyui-theme",
  daisyui5: "@sjsf/daisyui5-theme",
  flowbite: "@sjsf/flowbite-theme",
  skeleton: "@sjsf/skeleton-theme",
  shadcn: "@sjsf/shadcn-theme",
} satisfies Record<Theme, string>;

export function isTheme(str: string): str is Theme {
  return str in THEME_TITLES;
}

export const PKG_MANGERS = ["npm", "yarn", "pnpm", "bun"] as const;

export type PackageManager = (typeof PKG_MANGERS)[number];

export const PKG_MANGER_ICONS: Record<PackageManager, StarlightIcon> = {
  npm: "seti:npm",
  yarn: "seti:yarn",
  pnpm: "pnpm",
  bun: "bun",
};
