import sveltePage from "examples/zod-starter/src/routes/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "zod-starter",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
