import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/svelte-jsonschema-form/builder/",
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
      $apps: fileURLToPath(new URL("..", import.meta.url)),
    },
  },
});
