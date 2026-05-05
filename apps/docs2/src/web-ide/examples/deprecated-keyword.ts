import sveltePage from "examples/basic-starter/src/routes/deprecated-keyword/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
} satisfies Layer;
