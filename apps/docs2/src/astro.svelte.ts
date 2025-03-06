type DarkOrLight = "light" | "dark";
type Theme = "auto" | DarkOrLight;

const STORAGE_KEY = "starlight-theme";

const parseTheme = (theme: unknown): Theme =>
  theme === "auto" || theme === "dark" || theme === "light" ? theme : "auto";

const loadTheme = (): Theme =>
  parseTheme(
    typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)
  );

const getPreferredColorScheme = (): DarkOrLight =>
  matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

export function createAstro() {
  let theme = $state(loadTheme());

  $effect(() => {
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
    const updateTheme = (e: Event) => {
      if (!(e.currentTarget instanceof HTMLSelectElement)) {
        return;
      }
      theme = parseTheme(e.currentTarget.value);
    };
    themeSelect.addEventListener("change", updateTheme);
    return () => themeSelect.removeEventListener("change", updateTheme);
  });

  const darkOrLight = $derived(
    theme === "auto" ? getPreferredColorScheme() : theme
  );

  return {
    get theme() {
      return theme;
    },
    get darkOrLight() {
      return darkOrLight;
    },
  };
}
