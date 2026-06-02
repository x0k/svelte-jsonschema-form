import pageSvelte from "examples/basic-starter/src/routes/layout-slots/+page.svelte?raw";
import layoutSvelte from "examples/basic-starter/src/routes/layout-slots/layout.svelte?raw";

import { defineExample } from "../shared.js";

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
});
