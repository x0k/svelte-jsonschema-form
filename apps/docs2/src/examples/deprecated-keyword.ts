import sveltePage from "examples/basic-starter/src/routes/deprecated-keyword/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "deprecated-keyword",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
