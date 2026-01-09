import descriptionSvelte from "%/basic-starter/src/routes/markdown-description/description.svelte?raw";
import pageSvelte from "%/basic-starter/src/routes/markdown-description/+page.svelte?raw";
import packageJson from "%/basic-starter/package.json";

import {
  MARKDOWN_DESCRIPTION_PACKAGES,
  pickPackages,
  type Layer,
} from "../layer";

export const layer = {
  package: pickPackages(packageJson, MARKDOWN_DESCRIPTION_PACKAGES),
  files: {
    "src/routes/description.svelte": descriptionSvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
