import pageSvelte from "%/basic-starter/src/routes/layout-slots/+page.svelte?raw";
import layoutSvelte from "%/basic-starter/src/routes/layout-slots/layout.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
} satisfies Layer;
