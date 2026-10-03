import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      experimental: {
        remoteFunctions: true,
      },
      compilerOptions: {
        runes: true,
        experimental: {
          async: true,
        },
      },
    }),
  ],
});
