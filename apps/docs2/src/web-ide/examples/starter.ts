import sveltePage from "%/basic-starter/src/routes/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
} satisfies Layer;
