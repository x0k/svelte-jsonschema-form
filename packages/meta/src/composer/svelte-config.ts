import type { Config as KitConfig } from "@sveltejs/kit";

export interface SvelteCompilerOptions {
  runes?: NonNullable<KitConfig["compilerOptions"]>["runes"];
}

export interface SvelteKitConfig {
  alias?: Record<string, string>;
}

export interface SvelteConfig {
  compilerOptions?: SvelteCompilerOptions;
  kit?: SvelteKitConfig;
}

export function buildSvelteConfig(config: SvelteConfig) {
  const runes = config?.compilerOptions?.runes ?? true;
  const kitAlias = config?.kit?.alias ?? {};
  return `import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
    alias: ${JSON.stringify(kitAlias)},
  },
  compilerOptions: {
    runes: ${runes ? runes : "undefined"},
    experimental: {
      async: true,
    },
  },
};

export default config;
`;
}
