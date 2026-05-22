import pageSvelte from "examples/basic-starter/src/routes/pattern-properties-validator/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "pattern-properties-validator",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
