import pageSvelte from "examples/basic-starter/src/routes/valibot-starter/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "valibot-starter",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
