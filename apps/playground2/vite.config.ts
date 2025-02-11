import { resolve } from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/svelte-jsonschema-form/playground/",
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
