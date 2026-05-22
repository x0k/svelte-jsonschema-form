import { sveltekitPackage, svelteKitRfSubPath } from "../../sveltekit.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: [sveltekitPackage],
  },
  formDefaults: {
    idBuilderPackage: svelteKitRfSubPath(),
  },
  vite: {
    optimizeDeps: {
      exclude: ["@sjsf/form", "@sjsf/sveltekit/rf/client"],
    },
  },
});
