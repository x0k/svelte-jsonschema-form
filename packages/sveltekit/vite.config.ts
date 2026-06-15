import { resolve } from "node:path";

import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ strict: false }),
      compilerOptions: {
        experimental: { async: true },
      },
      experimental: {
        remoteFunctions: true,
        handleRenderingErrors: true,
      },
    }),
  ],
  test: {
    projects: [
      {
        // Client-side tests (Svelte components)
        extends: "./vite.config.ts",
        test: {
          name: "client",
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
          setupFiles: ["vitest-browser-svelte"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        // SSR tests (Server-side rendering)
        extends: "./vite.config.ts",
        test: {
          testTimeout: 10000,
          name: "ssr",
          environment: "node",
          include: ["src/**/*.ssr.{test,spec}.{js,ts}"],
          alias: {
            "$app/state": resolve("./mocks/app-state.ts"),
          },
        },
      },
      {
        // Server-side tests (Node.js utilities)
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: [
            "src/**/*.svelte.{test,spec}.{js,ts}",
            "src/**/*.ssr.{test,spec}.{js,ts}",
          ],
        },
      },
    ],
  },
});
