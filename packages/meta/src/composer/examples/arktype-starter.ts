import sveltePage from "examples/arktype-starter/src/routes/+page.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "arktype-starter",
    dependencies: [extraPackage("arktype")],
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
