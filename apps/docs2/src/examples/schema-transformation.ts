import sveltePage from "examples/basic-starter/src/routes/schema-transformation/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "schema-transformation",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
