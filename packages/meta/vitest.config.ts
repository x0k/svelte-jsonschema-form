import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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
  return {
    name: "meta:raw-examples",
    enforce: "pre",
    resolveId(id) {
      const [file, query] = id.split("?");
      return query === "raw" && file.startsWith(EXAMPLES)
        ? PREFIX + resolveFile(file)
        : null;
    },
    load(id) {
      if (!id.startsWith(PREFIX)) {
        return null;
      }
      const source = readFileSync(id.slice(PREFIX.length), "utf8");
      return `export default ${JSON.stringify(source)}`;
    },
  };
}

export default defineConfig({
  plugins: [rawExamples()],
  test: {
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      examples: EXAMPLES,
    },
  },
});
