import pageSvelte from "examples/basic-starter/src/routes/layout-slots/+page.svelte?raw";
import layoutSvelte from "examples/basic-starter/src/routes/layout-slots/layout.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "layout-slots",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
});
