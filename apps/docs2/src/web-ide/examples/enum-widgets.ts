import pageSvelte from "%/basic-starter/src/routes/enum-widgets/+page.svelte?raw";
import radioWithOrderSvelte from "%/basic-starter/src/routes/enum-widgets/radio-with-other.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/radio-with-other.svelte": radioWithOrderSvelte,
  },
} satisfies Layer;
