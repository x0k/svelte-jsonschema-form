import { resolve } from "node:path";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        "lib/array": resolve(__dirname, "src/lib/array.ts"),
        "lib/file": resolve(__dirname, "src/lib/file.ts"),
        "lib/function": resolve(__dirname, "src/lib/function.ts"),
        "lib/object": resolve(__dirname, "src/lib/object.ts"),
        "lib/svelte": resolve(__dirname, "src/lib/svelte.svelte.ts"),
        "lib/types": resolve(__dirname, "src/lib/types.ts"),
        "core/schema": resolve(__dirname, "src/core/schema/index.ts"),
        "core/config": resolve(__dirname, "src/core/config.ts"),
        "core/enum": resolve(__dirname, "src/core/enum.ts"),
        "core/id-schema": resolve(__dirname, "src/core/id-schema.ts"),
        "core/translation": resolve(__dirname, "src/core/translation.ts"),
        "core/ui-schema": resolve(__dirname, "src/core/ui-schema.ts"),
        form: resolve(__dirname, "src/form/index.ts"),
        "translations/en": resolve(__dirname, "src/translations/en.ts"),
        "validators/ajv": resolve(__dirname, "src/validators/ajv.ts"),
        "themes/basic": resolve(__dirname, "src/themes/basic/index.ts"),
      },
      formats: ["es"],
    },
  },
  plugins: [svelte(), dts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
