import sveltePage from "%/typebox-starter/src/routes/+page.svelte?raw";
import packageJson from "%/typebox-starter/package.json";

import type { Layer } from "../layer";

export const layer = {
  package: packageJson,
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
} satisfies Layer;
