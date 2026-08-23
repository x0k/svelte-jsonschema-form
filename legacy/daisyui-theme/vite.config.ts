import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://kit.svelte.dev/docs/integrations#preprocessors
      // for more information about preprocessors
      preprocess: vitePreprocess(),

      // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://kit.svelte.dev/docs/adapters for more information about adapters.
      adapter: adapter({ strict: false }),
    }),
  ],
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
          exclude: ["src/lib/server/**"],
          setupFiles: ["vitest-browser-svelte"],
          browser: {
            enabled: true,
            provider: playwright(),
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
    ],
  },
});
