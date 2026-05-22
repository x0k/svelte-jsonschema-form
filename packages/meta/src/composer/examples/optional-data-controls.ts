import sveltePage from "examples/basic-starter/src/routes/optional-data-controls/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "optional-data-controls",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
