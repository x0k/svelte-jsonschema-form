import sveltePage from "examples/valibot-starter/src/routes/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "valibot-starter",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
