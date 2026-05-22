import sveltePage from "examples/basic-starter/src/routes/label-on-left/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "label-on-left",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
