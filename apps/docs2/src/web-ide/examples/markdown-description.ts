import descriptionSvelte from "%/markdown-description/src/routes/description.svelte?raw";
import pageSvelte from "%/markdown-description/src/routes/+page.svelte?raw";
import packageJson from "%/markdown-description/package.json";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/routes/description.svelte": descriptionSvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
