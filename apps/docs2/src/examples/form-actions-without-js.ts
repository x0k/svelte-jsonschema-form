import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "form-actions-without-js",
  },
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
