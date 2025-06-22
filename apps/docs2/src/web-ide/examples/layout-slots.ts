import pageSvelte from "%/layout-slots/src/routes/+page.svelte?raw";
import layoutSvelte from "%/layout-slots/src/routes/layout.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
} satisfies Layer;
