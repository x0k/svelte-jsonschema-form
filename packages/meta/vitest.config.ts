import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const EXAMPLES = resolve(__dirname, "../../examples");

/** Vite resolves extensionless specifiers; these imports are written that way */
const EXTENSIONS = [".ts", ".svelte", ".js", ".mjs", ".json"];

function resolveFile(file: string): string {
  if (existsSync(file)) {
    return file;
  }
  for (const ext of EXTENSIONS) {
    if (existsSync(`${file}${ext}`)) {
      return `${file}${ext}`;
    }
  }
  throw new Error(`No example source for "${file}"`);
}

/**
 * Serves `examples/**?raw` straight from disk, as a virtual module.
 *
 * The demo entries pull example sources in as raw strings. Left to Vite, the
 * `.ts` ones still go through the oxc transform, which resolves the nearest
 * `tsconfig.json` — and those now extend `$app/tsconfig`, which only
 * `svelte-kit sync` can resolve. Raw text needs no transform, so hand it back
 * under a virtual id, which the transform pipeline skips.
 */
function rawExamples(): Plugin {
  const PREFIX = "\0raw:";
  /**
   * Keeps the virtual id from ending in the real extension. Without it the
   * `svelte` plugin below claims `.../+page.svelte` as a component and tries
   * to compile a JSON string as Svelte source.
   */
  const SUFFIX = ".txt";
  return {
    name: "meta:raw-examples",
    enforce: "pre",
    resolveId(id) {
      const [file, query] = id.split("?");
      return query === "raw" && file.startsWith(EXAMPLES)
        ? PREFIX + resolveFile(file) + SUFFIX
        : null;
    },
    load(id) {
      if (!id.startsWith(PREFIX)) {
        return null;
      }
      const source = readFileSync(
        id.slice(PREFIX.length, id.length - SUFFIX.length),
        "utf8"
      );
      return `export default ${JSON.stringify(source)}`;
    },
  };
}

export default defineConfig({
  // The playground sources under test are runes modules. The plugin compiles
  // them so `$state` and friends resolve, as in every validator package.
  plugins: [svelte(), rawExamples()],
  test: {
    // `*.test.svelte.ts` is how the plugin-enabled packages name runes test
    // modules, so it needs matching coverage here.
    include: ["**/*.test.ts", "**/*.test.svelte.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      examples: EXAMPLES,
    },
  },
});
