import { dependencies } from "%/basic-starter/package.json";
import pageSvelte from "%/basic-starter/src/routes/+page.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  package: {
    dependencies,
  },
  formDefaults: { theme: "basic" },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
