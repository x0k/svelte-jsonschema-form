import sveltePage from "examples/basic-starter/src/routes/label-on-left/+page.svelte?raw";

import { defineExample } from "../model.ts";

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
