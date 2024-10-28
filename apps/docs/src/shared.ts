export const THEMES = ["basic", "daisyui", "flowbite", "skeleton", "shadcn"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TTITLES = {
  basic: "Basic",
  daisyui: "DaisyUI",
  flowbite: "Flowbite",
  skeleton: "Skeleton",
  shadcn: "Shadcn",
} satisfies Record<Theme, string>;
