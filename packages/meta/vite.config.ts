/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  test: {},
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      examples: resolve(__dirname, "../../examples"),
    },
  },
});
