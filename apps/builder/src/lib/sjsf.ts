export enum Theme {
  Basic = "basic",
  Daisy5 = "daisy5",
  Flowbite3 = "flowbite3",
  Skeleton3 = "skeleton3",
  Shadcn4 = "shadcn4",
}

export const THEMES = Object.values(Theme);

export const THEME_TITLES: Record<Theme, string> = {
  [Theme.Basic]: "Basic",
  [Theme.Daisy5]: "daisyUI v5",
  [Theme.Flowbite3]: "Flowbite Svelte",
  [Theme.Skeleton3]: "Skeleton v3",
  [Theme.Shadcn4]: "shadcn-svelte",
};
