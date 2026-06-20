import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/sv-utils.ts"],
  format: "esm",
  deps: {
    onlyBundle: ["@x0k/sv-utils", "acorn", "@sveltejs/acorn-typescript"],
  },
});
