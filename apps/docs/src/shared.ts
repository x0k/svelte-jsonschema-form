export const THEMES = ["basic", "daisyui", "flowbite", "skeleton"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TTITLES = {
  basic: "Basic",
  daisyui: "DaisyUI",
  flowbite: "Flowbite",
  skeleton: "Skeleton",
} satisfies Record<Theme, string>;
