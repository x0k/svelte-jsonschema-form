import sveltePage from "examples/basic-starter/src/routes/label-on-left/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "label-on-left",
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
