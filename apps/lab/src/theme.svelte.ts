import { MediaQuery } from "svelte/reactivity";

import { Theme, type DarkOrLight } from "./shared.js";

export interface ThemeManager {
  theme: Theme;
  readonly darkOrLight: DarkOrLight;
  sync: () => void;
}

const THEME_STORAGE_KEY = 'sjsf-lab-theme'

function createThemeManager() {
  const preferredColorSchemeQuery = new MediaQuery(
    "(prefers-color-scheme: dark)"
  );
  let theme = $state(
    (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ??
      (preferredColorSchemeQuery.current ? Theme.Dark : Theme.Light)
  );
  const darkOrLight = $derived(
    theme === Theme.System
      ? preferredColorSchemeQuery.current
        ? Theme.Dark
        : Theme.Light
      : theme
  );
  function sync() {
    document.documentElement.setAttribute("data-theme", darkOrLight);
  }
  return {
    sync,
    get theme() {
      return theme;
    },
    set theme(v) {
      theme = v;
      localStorage.setItem(THEME_STORAGE_KEY, v);
      sync();
    },
    get darkOrLight() {
      return darkOrLight;
    },
  } satisfies ThemeManager;
}

export const themeManager = createThemeManager();
