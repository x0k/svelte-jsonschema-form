import pageSvelte from "examples/basic-starter/src/routes/formulas/+page.svelte?raw";
import objectFieldSvelte from "examples/basic-starter/src/routes/formulas/object-field.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "formulas",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/object-field.svelte": objectFieldSvelte,
  },
});
