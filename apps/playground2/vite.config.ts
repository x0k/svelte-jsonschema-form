import { resolve, dirname } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
// import { visualizer } from "rollup-plugin-visualizer";
import { extraPackage } from "meta";
import { defineConfig } from "vitest/config";

const VIRTUAL_MODULE_PREFIX = "virtual-module:";

const zodVersion = extraPackage("zod").version;
const valibotVersion = extraPackage("valibot").version;

export default defineConfig({
  base: "/svelte-jsonschema-form/playground3/",
  plugins: [
    // visualizer(),
    tailwindcss(),
    svelte(),
  ],
  define: {
    "import.meta.env.IMPORT_MAP_ZOD": JSON.stringify(
      `https://esm.sh/zod@${zodVersion}`
    ),
    "import.meta.env.IMPORT_MAP_VALIBOT": JSON.stringify(
      `https://esm.sh/valibot@${valibotVersion}`
    ),
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      $lib: resolve("./src/lib"),
      examples: resolve(__dirname, "../../examples"),
    },
  },
  optimizeDeps: {
    exclude: ["@jis3r/icons"],
    include: ["svelte-tiler", "svelte-tiler/*", "svelte-sonner"],
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
    include: ["src/**/*.test.ts"],
  },
});
