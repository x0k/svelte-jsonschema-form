import { resolve, dirname } from "node:path";

import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const VIRTUAL_MODULE_PREFIX = "virtual-module:";

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://kit.svelte.dev/docs/integrations#preprocessors
      // for more information about preprocessors
      preprocess: vitePreprocess(),

      // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://kit.svelte.dev/docs/adapters for more information about adapters.
      adapter: adapter({
        // default options are shown. On some platforms
        // these options are set automatically — see below
        // pages: 'build',
        // assets: 'build',
        // fallback: undefined,
        // precompress: false,
        strict: false,
      }),
    }),
  ],
  optimizeDeps: {
    include: ["ajv", "esm-env", "jsonpointer", "flowbite-svelte/**"],
    rolldownOptions: {
      resolve: {
        conditionNames: ["svelte", "import", "node", "default"],
      },
      plugins: [
        {
          name: "fix-virtual-svelte-imports",
          resolveId(source, importer) {
            if (
              !source.endsWith(".svelte") ||
              !importer ||
              !source.startsWith(".")
            ) {
              return;
            }
            if (importer.startsWith(VIRTUAL_MODULE_PREFIX)) {
              const realPath = importer
                .slice(VIRTUAL_MODULE_PREFIX.length)
                .replace(/\?.*$/, "");
              return {
                id: resolve(dirname(realPath), source),
                external: true,
              };
            }
          },
        },
      ],
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
