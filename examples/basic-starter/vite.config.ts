import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      compilerOptions: { runes: true, experimental: { async: true } },
      adapter: adapter(),
      experimental: { remoteFunctions: true },
    }),
  ],
});
