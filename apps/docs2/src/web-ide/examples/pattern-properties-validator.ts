import pageSvelte from "examples/basic-starter/src/routes/pattern-properties-validator/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
