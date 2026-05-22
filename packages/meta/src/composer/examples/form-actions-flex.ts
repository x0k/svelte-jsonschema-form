import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "form-actions-flex",
  },
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
