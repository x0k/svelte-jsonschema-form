import type { Theme } from "@sjsf/form";

import basicStyles from "@sjsf/basic-theme/css/basic.css?raw";
import picoStyles from "@picocss/pico/css/pico.css?raw";
import picoAdapterStyles from "@sjsf/basic-theme/css/pico.css?raw";
import daisy5Styles from "@sjsf/daisyui5-theme/styles.css?raw";
import flowbite3Styles from "@sjsf/flowbite3-theme/styles.css?raw";
import skeleton4Styles from "@sjsf/skeleton4-theme/styles.css?raw";
import shadcn4Styles from "@sjsf/shadcn4-theme/styles.css?raw";
import beercssStyles from "beercss/dist/cdn/beer.min.css?raw";

import type { Generated } from "../types.ts";
import {
  isLegacyTheme,
  isThemeExtension,
  isThemeWithSubThemes,
  themes,
  themeSubThemes,
} from "../themes.ts";
import {
  basicTheme,
  beercssTheme,
  daisyui5Theme,
  flowbite3Theme,
  shadcn4Theme,
  skeleton4Theme,
  svarTheme,
} from "./themes.generated.ts";

export function* playgroundThemes() {
  for (const t of themes()) {
    if (isLegacyTheme(t) || isThemeExtension(t)) {
      continue;
    }
    yield t;
    if (isThemeWithSubThemes(t)) {
      yield* themeSubThemes(t);
    }
  }
}

export type PlaygroundTheme = Generated<typeof playgroundThemes>;

export const PLAYGROUND_SJSF_THEMES = {
  basic: basicTheme,
  pico: basicTheme,
  beercss: beercssTheme,
  daisyui5: daisyui5Theme,
  flowbite3: flowbite3Theme,
  shadcn4: shadcn4Theme,
  skeleton4: skeleton4Theme,
  svar: svarTheme,
} satisfies Record<PlaygroundTheme, Theme>;

const beerCssSettings = `
:host {
  --size: 1rem;
  --font: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Noto Sans, Arial, sans-serif;
  --font-icon: "Material Symbols Outlined";
  --speed1: 0.1s;
  --speed2: 0.2s;
  --speed3: 0.3s;
  --speed4: 0.4s;
  --active: rgb(128 128 128 / 0.192);
  --overlay: rgb(0 0 0 / 0.5);
  --elevate1: 0 0.125rem 0.125rem 0 rgb(0 0 0 / 0.32);
  --elevate2: 0 0.25rem 0.5rem 0 rgb(0 0 0 / 0.4);
  --elevate3: 0 0.375rem 0.75rem 0 rgb(0 0 0 / 0.48);
  --top: env(safe-area-inset-top);
  --bottom: env(safe-area-inset-bottom);
  --left: env(safe-area-inset-left);
  --right: env(safe-area-inset-right);
}
:host, .light {
  --primary: #6750a4;
  --on-primary: #ffffff;
  --primary-container: #e9ddff;
  --on-primary-container: #22005d;
  --secondary: #625b71;
  --on-secondary: #ffffff;
  --secondary-container: #e8def8;
  --on-secondary-container: #1e192b;
  --tertiary: #7e5260;
  --on-tertiary: #ffffff;
  --tertiary-container: #ffd9e3;
  --on-tertiary-container: #31101d;
  --error: #ba1a1a;
  --on-error: #ffffff;
  --error-container: #ffdad6;
  --on-error-container: #410002;
  --background: #fffbff;
  --on-background: #1c1b1e;
  --surface: #fdf8fd;
  --on-surface: #1c1b1e;
  --surface-variant: #e7e0eb;
  --on-surface-variant: #49454e;
  --outline: #7a757f;
  --outline-variant: #cac4cf;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #313033;
  --inverse-on-surface: #f4eff4;
  --inverse-primary: #cfbcff;
  --surface-dim: #ddd8dd;
  --surface-bright: #fdf8fd;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #f7f2f7;
  --surface-container: #f2ecf1;
  --surface-container-high: #ece7eb;
  --surface-container-highest: #e6e1e6;
}
.dark {
  --primary: #cfbcff;
  --on-primary: #381e72;
  --primary-container: #4f378a;
  --on-primary-container: #e9ddff;
  --secondary: #cbc2db;
  --on-secondary: #332d41;
  --secondary-container: #4a4458;
  --on-secondary-container: #e8def8;
  --tertiary: #efb8c8;
  --on-tertiary: #4a2532;
  --tertiary-container: #633b48;
  --on-tertiary-container: #ffd9e3;
  --error: #ffb4ab;
  --on-error: #690005;
  --error-container: #93000a;
  --on-error-container: #ffb4ab;
  --background: #1c1b1e;
  --on-background: #e6e1e6;
  --surface: #141316;
  --on-surface: #e6e1e6;
  --surface-variant: #49454e;
  --on-surface-variant: #cac4cf;
  --outline: #948f99;
  --outline-variant: #49454e;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #e6e1e6;
  --inverse-on-surface: #313033;
  --inverse-primary: #6750a4;
  --surface-dim: #141316;
  --surface-bright: #3a383c;
  --surface-container-lowest: #0f0e11;
  --surface-container-low: #1c1b1e;
  --surface-container: #201f22;
  --surface-container-high: #2b292d;
  --surface-container-highest: #363438;
}`;

export const PLAYGROUND_SJSF_THEME_STYLES = {
  basic: basicStyles,
  daisyui5: daisy5Styles,
  flowbite3: flowbite3Styles,
  skeleton4: skeleton4Styles,
  shadcn4: shadcn4Styles,
  svar: "",
  pico: `${picoStyles}${picoAdapterStyles}`,
  beercss: `${beercssStyles}\n${beerCssSettings}`,
} satisfies Record<PlaygroundTheme, string>;
