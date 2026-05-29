import sveltePage from "examples/basic-starter/src/routes/zod-starter/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "zod-starter",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
