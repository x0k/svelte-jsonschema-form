import sveltePage from "examples/typebox-starter/src/routes/+page.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "typebox-starter",
    dependencies: [extraPackage("typebox")],
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
