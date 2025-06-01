import { resolve } from "node:path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";

export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  build: {
    target: "esnext",
  },
  worker: {
    format: "es",
  },
  esbuild: {
    minifySyntax: false,
  },
  optimizeDeps: {
    include: [
      "@codingame/monaco-vscode-api/extensions",
      "@codingame/monaco-vscode-api",
      "@codingame/monaco-vscode-api/monaco",
      "vscode/localExtensionHost",

      // These 2 lines prevent vite from reloading the whole page when starting a worker (so 2 times in a row after cleaning the vite cache - for the editor then the textmate workers)
      // it's mainly empirical and probably not the best way, fix me if you find a better way
      "vscode-textmate",
      "vscode-oniguruma",
      "@vscode/vscode-languagedetection",
      "marked",
    ],
    exclude: ["@sjsf/cfworker-validator"],
    esbuildOptions: {
      tsconfig: "./tsconfig.json",
      plugins: [importMetaUrlPlugin],
    },
  },
  define: {
    rootDirectory: JSON.stringify(__dirname),
  },
  base: "/svelte-jsonschema-form/lab/",
  plugins: [
    {
      name: "load-vscode-css-as-string",
      enforce: "pre",
      async resolveId(source, importer, options) {
        const resolved = (await this.resolve(source, importer, options))!;
        if (
          resolved.id.match(
            /node_modules\/(@codingame\/monaco-vscode|vscode|monaco-editor).*\.css$/
          )
        ) {
          return {
            ...resolved,
            id: resolved.id + "?inline",
          };
        }
        return undefined;
      },
    },
    svelte(),
  ],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
});
