import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: "/svelte-jsonschema-form/playground3/",
  plugins: [
    ,
    // visualizer({})
    tailwindcss(),
    svelte(),
  ],
  resolve: {
    alias: { "@": resolve(__dirname, "./src"), $lib: resolve("./src/lib") },
  },
  optimizeDeps: {
    exclude: ["@jis3r/icons"],
    include: ["svelte-tiler", "svelte-tiler/*"],
  },
});
