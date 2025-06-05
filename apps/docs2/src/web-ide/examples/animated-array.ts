import animatedArraySvelte from "%/animated-array/src/routes/animated-array.svelte?raw";
import pageSvelte from "%/animated-array/src/routes/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/animated-array.svelte": animatedArraySvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
