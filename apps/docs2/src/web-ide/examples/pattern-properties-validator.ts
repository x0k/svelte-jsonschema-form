import pageSvelte from "%/pattern-properties-validator/src/routes/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
