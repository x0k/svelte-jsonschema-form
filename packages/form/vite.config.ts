/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  test: {},
  plugins: [svelte()],
  resolve: {
    conditions: process.env.VITEST ? ["browser"] : [],
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
