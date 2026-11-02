import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

const exclude = ["dist", ".svelte-kit", "node_modules"];
export default defineConfig({
  plugins: [svelte()],
  test: {
    exclude,
  },
});
