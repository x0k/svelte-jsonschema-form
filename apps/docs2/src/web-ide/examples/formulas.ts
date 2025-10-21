import pageSvelte from "%/basic-starter/src/routes/formulas/+page.svelte?raw";
import objectFieldSvelte from "%/basic-starter/src/routes/formulas/object-field.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/object-field.svelte": objectFieldSvelte,
  },
} satisfies Layer;
