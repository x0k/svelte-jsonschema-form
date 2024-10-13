export const THEMES = ["basic", "daisyui", "flowbite"] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_TTITLES = {
  basic: "Basic",
  daisyui: "DaisyUI",
  flowbite: "Flowbite",
} satisfies Record<Theme, string>;
