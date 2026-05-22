import sveltePage from "examples/basic-starter/src/routes/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "starter",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
