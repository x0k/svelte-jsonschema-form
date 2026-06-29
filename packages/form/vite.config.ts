/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const exclude = ["dist", ".svelte-kit", "node_modules"];
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    exclude,
    typecheck: {
      exclude,
      // `*.svelte` files are not supported by tsc
      ignoreSourceErrors: true,
    },
    benchmark: {
      exclude,
      // Suppress warnings about excessive module export getter access.
      // The benchmarked functions (shallowAllOfMerge, deepAllOfMerge) internally call
      // isAllowAnySchema and isRecordEmpty millions of times through Vite's module runner.
      // These are deep in the library call chain and cannot be cached locally in benchmark files.
      suppressExportGetterWarnings: true,
    },
  },
});
