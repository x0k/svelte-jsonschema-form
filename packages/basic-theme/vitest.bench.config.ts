import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    include: ["tests/benchmarks/**/*.bench.ts"],
    setupFiles: ["vitest-browser-svelte"],
    testTimeout: 120_000,
    optimizeDeps: {
      exclude: ["theme-testing/demo"],
    },
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
    },
  },
});
