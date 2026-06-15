import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig } from "@sveltejs/load-config";
import ts from "typescript-eslint";

// @ts-check
import { svelteConfig } from "../../eslint.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const loaded = await loadConfig(__dirname, { traverse: false });

if (!loaded || !("config" in loaded)) {
  throw new Error("Failed to load Svelte config from vite.config.ts");
}

export default [
  ...svelteConfig,
  {
    files: ["src/**/*.svelte", "src/**/*.svelte.ts", "src/**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig: loaded.config,
      },
    },
  },
];
