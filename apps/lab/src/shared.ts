export enum Theme {
  System = "system",
  Light = "light",
  Dark = "dark",
}

export const THEME_TITLES: Record<Theme, string> = {
  [Theme.System]: "System",
  [Theme.Light]: "Light",
  [Theme.Dark]: "Dark",
}

export const THEMES = Object.values(Theme);

export type DarkOrLight = Theme.Dark | Theme.Light;
