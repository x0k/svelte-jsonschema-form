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
    (_filepath, code) => code.replace("remote-form-defaults", "form-defaults"),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@sjsf/form", "@sjsf/sveltekit/rf/client"],
    },
  },
});
