import type { StarlightIcon } from '@astrojs/starlight/types';

export const THEMES = [
  "basic",
  "daisyui",
  "flowbite",
  "skeleton",
  "shadcn",
] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TITLES = {
  basic: "Basic",
  daisyui: "DaisyUI",
  flowbite: "Flowbite",
  skeleton: "Skeleton",
  shadcn: "Shadcn",
} satisfies Record<Theme, string>;

export const THEME_PACKAGES = {
  basic: "",
  daisyui: "@sjsf/daisyui-theme",
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
