import { sveltekitPackage } from "../../sveltekit.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: [sveltekitPackage],
  },
  formDefaults: {
    idBuilderPackage: sveltekitPackage.name,
  },
});
