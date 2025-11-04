import sveltePage from "%/arktype-starter/src/routes/+page.svelte?raw";
import packageJson from "%/arktype-starter/package.json";

import type { Layer } from "../layer";

export const layer = {
  package: packageJson,
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
} satisfies Layer;
