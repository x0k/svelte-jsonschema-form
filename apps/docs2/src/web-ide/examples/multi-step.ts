import pageSvelte from "examples/basic-starter/src/routes/multi-step/+page.svelte?raw";
import multiStepFieldSvelte from "examples/basic-starter/src/routes/multi-step/multi-step-field.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/multi-step-field.svelte": multiStepFieldSvelte,
  },
} satisfies Layer;
