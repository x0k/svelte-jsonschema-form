import pageSvelte from "examples/basic-starter/src/routes/nullable-fields/+page.svelte?raw";
import nullableFieldSvelte from "examples/basic-starter/src/routes/nullable-fields/nullable-field.svelte?raw";

import { defineExample } from "../model.ts";

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/nullable-field.svelte": nullableFieldSvelte,
  },
});
