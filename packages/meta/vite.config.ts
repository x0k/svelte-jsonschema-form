/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        playground: resolve(__dirname, "src/playground/index.ts"),
      },
      formats: ["es"],
    },
  },
  test: {},
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
