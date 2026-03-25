import pageSvelte from "examples/basic-starter/src/routes/nullable-fields/+page.svelte?raw";
import nullableFieldSvelte from "examples/basic-starter/src/routes/nullable-fields/nullable-field.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/nullable-field.svelte": nullableFieldSvelte,
  },
} satisfies Layer;
