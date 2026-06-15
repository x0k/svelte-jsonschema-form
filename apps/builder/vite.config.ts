import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  base: "/svelte-jsonschema-form/builder3/",
  plugins: [tailwindcss(), svelte(), Icons({ compiler: "svelte" })],
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
