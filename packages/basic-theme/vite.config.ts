import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defaultExclude } from "vitest/config";
import { defineConfig } from "vitest/config";

const vrtPattern = "**/*.vrt.test.[tj]s?(x)";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    projects: [
      {
        extends: "./vite.config.ts",
        optimizeDeps: {
          exclude: ["theme-testing/demo"],
        },
        test: {
          name: "client",
          include: [
            "src/**/*.svelte.{test,spec}.{js,ts}",
            "tests/**/*.svelte.{test,spec}.{js,ts}",
          ],
          exclude: ["src/lib/server/**", vrtPattern, ...defaultExclude],
          setupFiles: ["vitest-browser-svelte"],
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
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: [
            "src/**/*.{test,spec}.{js,ts}",
            "tests/**/*.ssr.{test,spec}.{js,ts}",
          ],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
      {
        extends: "./vite.config.ts",
        optimizeDeps: {
          exclude: ["theme-testing/demo"],
          include: ["@sveltejs/svelte-json-tree", "ajv"],
        },
        test: {
          name: "vrt",
          include: [vrtPattern],
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [
              {
                browser: "chromium",
                viewport: { width: 1400, height: 900 },
              },
            ],
          },
        },
      },
    ],
  },
});
