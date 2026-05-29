import pageSvelte from "examples/basic-starter/src/routes/decomposed-field/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "decomposed-field",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
