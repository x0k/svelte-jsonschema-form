import packageJson from "%/formulas/package.json";
import pageSvelte from "%/formulas/src/routes/+page.svelte?raw";
import objectFieldSvelte from "%/formulas/src/routes/object-field.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/object-field.svelte": objectFieldSvelte,
  },
} satisfies Layer;
