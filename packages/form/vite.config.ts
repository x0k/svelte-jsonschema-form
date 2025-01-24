/// <reference types="vitest/config" />
import { resolve } from "node:path";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ['./vitest-setup.ts']
  },
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
