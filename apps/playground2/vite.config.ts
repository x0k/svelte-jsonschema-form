import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "/svelte-jsonschema-form/playground2/",
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src"), $lib: resolve("./src/lib") },
  },
});
