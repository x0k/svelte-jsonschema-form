import { MediaQuery } from "svelte/reactivity";

type DarkOrLight = "light" | "dark";
type Theme = "auto" | DarkOrLight;

const STORAGE_KEY = "starlight-theme";

export interface ThemeManager {
  theme: Theme;
  readonly darkOrLight: DarkOrLight;
  readonly isDark: boolean;
  sync: () => void;
}

function createThemeManager(
  get: () => Theme | undefined,
  set: (theme: Theme) => void,
  sync: (manager: ThemeManager) => void
) {
  const preferredColorSchemeQuery = new MediaQuery(
    "(prefers-color-scheme: dark)"
  );
  let theme = $state(get() ?? "auto");
  const darkOrLight = $derived(
    theme === "auto"
      ? preferredColorSchemeQuery.current
        ? "dark"
        : "light"
      : theme
  );
  const isDark = $derived(darkOrLight === "dark");
  const manager = {
    sync() {
      sync(manager);
    },
    get theme() {
      return theme;
    },
    set theme(v) {
      theme = v;
      set(v);
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

export function createDumbThemeManager(theme: Theme): ThemeManager {
  const isDark = theme === "dark";
  return {
    theme,
    isDark,
    darkOrLight: isDark ? "dark" : "light",
    sync() {},
  };
}

export let themeManager: ThemeManager = createDumbThemeManager("auto");

const parseTheme = (theme: unknown): Theme =>
  theme === "auto" || theme === "dark" || theme === "light" ? theme : "auto";

const loadTheme = (): Theme =>
  parseTheme(
    typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)
  );

$effect.root(() => {
  const starlightThemeSelect = document
    .getElementsByTagName("starlight-theme-select")
    .item(0);
  if (starlightThemeSelect === null) {
    return;
  }
  const themeSelect = starlightThemeSelect
    .getElementsByTagName("select")
    .item(0);
  if (themeSelect === null) {
    return;
  }
  themeManager = createThemeManager(
    loadTheme,
    () => {},
    () => {}
  );

  function updateTheme(e: Event) {
    if (!(e.currentTarget instanceof HTMLSelectElement)) {
      return;
    }
    themeManager.theme = parseTheme(e.currentTarget.value);
  }

  themeSelect.addEventListener("change", updateTheme);
  return () => {
    themeSelect.removeEventListener("change", updateTheme);
  };
});
