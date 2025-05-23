import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";

export default defineConfig({
  // server: {
  //   headers: {
  //     "Cross-Origin-Embedder-Policy": "require-corp",
  //     "Cross-Origin-Opener-Policy": "same-origin",
  //   },
  // },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    // include: [
    //   "vscode-textmate",
    //   "vscode-oniguruma",
    //   "@vscode/vscode-languagedetection",
    // ],
    exclude: ["@sjsf/cfworker-validator"],
    esbuildOptions: {
      plugins: [importMetaUrlPlugin],
    },
  },
  base: "/svelte-jsonschema-form/lab/",
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
