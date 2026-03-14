import sveltePage from "examples/typebox-starter/src/routes/+page.svelte?raw";
import packageJson from "examples/typebox-starter/package.json";

import type { Layer } from "../layer";

export const layer = {
  package: packageJson,
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
} satisfies Layer;
