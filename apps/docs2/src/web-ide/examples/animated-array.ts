import animatedArraySvelte from "examples/basic-starter/src/routes/animated-array/animated-array.svelte?raw";
import pageSvelte from "examples/basic-starter/src/routes/animated-array/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/animated-array.svelte": animatedArraySvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
