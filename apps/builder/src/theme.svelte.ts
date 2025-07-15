import { MediaQuery } from "svelte/reactivity";

import { Theme, type DarkOrLight } from "./shared/index.js";

export interface ThemeManager {
  theme: Theme;
  readonly darkOrLight: DarkOrLight;
  readonly isDark: boolean;
  sync: () => void;
}

const THEME_STORAGE_KEY = "theme";

function createThemeManager(sync: (manager: ThemeManager) => void) {
  const preferredColorSchemeQuery = new MediaQuery(
    "(prefers-color-scheme: dark)"
  );
  let theme = $state(
    (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? Theme.System
  );
  const darkOrLight = $derived(
    theme === Theme.System
      ? preferredColorSchemeQuery.current
        ? Theme.Dark
        : Theme.Light
      : theme
  );
  const isDark = $derived(darkOrLight === Theme.Dark);
  const manager = {
    sync() {
      sync(manager);
    },
    get theme() {
      return theme;
    },
    set theme(v) {
      theme = v;
      localStorage.setItem(THEME_STORAGE_KEY, v);
      sync(manager);
    },
    get darkOrLight() {
      return darkOrLight;
    },
    get isDark() {
      return isDark;
    },
  } satisfies ThemeManager;
  return manager;
}

export let themeManager: ThemeManager;

$effect.root(() => {
  themeManager = createThemeManager((m) => {
    if (m.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
});
