import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.svelte?raw";

import { defineExample } from "../model.ts";

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
