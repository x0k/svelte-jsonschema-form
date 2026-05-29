import pageSvelte from "examples/basic-starter/src/routes/nullable-fields/+page.svelte?raw";
import nullableFieldSvelte from "examples/basic-starter/src/routes/nullable-fields/nullable-field.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "nullable-fields",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/nullable-field.svelte": nullableFieldSvelte,
  },
});
