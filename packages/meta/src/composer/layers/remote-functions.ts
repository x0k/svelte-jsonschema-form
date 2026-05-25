import { sveltekitPackage, svelteKitRfSubPath } from "../../sveltekit.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: [sveltekitPackage],
  },
  formDefaults: {
    idBuilderPackage: svelteKitRfSubPath(),
  },
  codeTransformers: [
    (filepath, code) =>
      filepath.endsWith("+page.svelte")
        ? code.replace("remote-form-defaults", "form-defaults")
        : code,
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@sjsf/form", "@sjsf/sveltekit/rf/client"],
    },
  },
});
