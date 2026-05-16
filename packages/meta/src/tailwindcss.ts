import type { AbstractPackage } from "./package.ts";

const TAILWINDCSS4_PLUGINS = {
  typography: {
    name: "@tailwindcss/typography",
    version: "0.5.19",
    dev: true,
  },
  forms: {
    name: "@tailwindcss/forms",
    version: "0.5.11",
    dev: true,
  },
} as const satisfies Record<string, AbstractPackage>;

export type Tailwindcss4Plugin = keyof typeof TAILWINDCSS4_PLUGINS;

export function tailwindcss4PluginPackage(
  plugin: Tailwindcss4Plugin,
): AbstractPackage {
  return TAILWINDCSS4_PLUGINS[plugin];
}
