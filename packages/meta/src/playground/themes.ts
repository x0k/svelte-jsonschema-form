import type { Theme } from "@sjsf/form";

import type { PlaygroundTheme } from "./model.ts";
import {
  basicTheme,
  beercssTheme,
  daisyui5Theme,
  flowbite3Theme,
  shadcn4Theme,
  skeleton4Theme,
  svarTheme,
  shadcn_extrasTheme,
} from "./themes.generated.ts";
// NOTE: Required for types augmentation
// DO NOT REMOVE
import "./themes.generated.ts";
export {
  PLAYGROUND_SJSF_THEME_STYLES,
  PLAYGROUND_SJSF_GLOBAL_THEME_STYLES,
} from "./theme-styles.generated.ts";

export const PLAYGROUND_SJSF_THEMES = {
  basic: basicTheme,
  pico: basicTheme,
  beercss: beercssTheme,
  daisyui5: daisyui5Theme,
  flowbite3: flowbite3Theme,
  shadcn4: shadcn4Theme,
  skeleton4: skeleton4Theme,
  svar: svarTheme,
  "shadcn-extras": shadcn_extrasTheme,
} satisfies Record<PlaygroundTheme, Theme>;
