import { resolve, dirname } from "node:path";

import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defaultExclude } from "vitest/config";
import { defineConfig } from "vitest/config";

const vrtPattern = "**/*.vrt.test.[tj]s?(x)";
const VIRTUAL_MODULE_PREFIX = "virtual-module:";

export default defineConfig({
  plugins: [
    tailwindcss(),
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
    include: [
      "@sveltejs/svelte-json-tree",
      "ajv",
      "esm-env",
      "jsonpointer",
      "flowbite-svelte/**",
    ],
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
          exclude: ["src/lib/server/**", vrtPattern, ...defaultExclude],
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
      {
        extends: "./vite.config.ts",
        optimizeDeps: {
          exclude: ["theme-testing/demo"],
        },
        test: {
          name: "vrt",
          include: process.env.CI ? [] : [vrtPattern],
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
