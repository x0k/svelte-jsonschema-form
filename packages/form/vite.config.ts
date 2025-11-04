/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

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
    },
  },
});
