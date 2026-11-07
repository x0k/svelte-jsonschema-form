import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [svelte({ preprocess: vitePreprocess() })],
  build: {
    minify: "esbuild",
    reportCompressedSize: false,
    outDir: "dist-form",
    emptyOutDir: true,
    rollupOptions: {
      input: "form.html",
      external: ["svelte", /^svelte\//],
    },
  },
});
