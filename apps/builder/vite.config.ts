import { resolve } from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { importMapPlugin } from "meta/vite-importmap";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/svelte-jsonschema-form/builder3/",
  plugins: [
    tailwindcss(),
    svelte(),
    Icons({ compiler: "svelte" }),
    importMapPlugin({
      imports: {
        zod: "zod",
        valibot: "valibot",
      },
    }),
  ],
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
      examples: resolve(__dirname, "../../examples"),
    },
  },
  optimizeDeps: {
    exclude: ["@jis3r/icons"],
    include: ["@svar-ui/svelte-core", "svelte-sonner"],
  },
});
