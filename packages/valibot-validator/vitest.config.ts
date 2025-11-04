import { defineConfig } from "vitest/config";

import { svelte } from "@sveltejs/vite-plugin-svelte";

const exclude = ["dist", ".svelte-kit", "node_modules"];

export default defineConfig({
  plugins: [svelte()],
  test: { exclude },
});
