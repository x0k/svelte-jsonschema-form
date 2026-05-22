import sveltePage from "examples/basic-starter/src/routes/deprecated-keyword/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "deprecated-keyword",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
