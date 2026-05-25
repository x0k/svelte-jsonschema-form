import pageSvelte from "examples/basic-starter/src/routes/valibot-starter/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "valibot-starter",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
