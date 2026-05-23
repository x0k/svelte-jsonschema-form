import { sveltekitPackage } from "../../sveltekit.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: [sveltekitPackage],
  },
  formDefaults: {
    idBuilderPackage: sveltekitPackage.name,
  },
});
