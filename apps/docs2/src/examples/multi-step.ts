import pageSvelte from "examples/basic-starter/src/routes/multi-step/+page.svelte?raw";
import multiStepFieldSvelte from "examples/basic-starter/src/routes/multi-step/multi-step-field.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "multi-step",
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/multi-step-field.svelte": multiStepFieldSvelte,
  },
});
