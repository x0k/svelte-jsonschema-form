import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";
import packageJson from "examples/basic-starter/package.json";

import { DRAFT_2020_12_PACKAGES, pickPackages, type Layer } from "../layer";

export const layer = {
  package: pickPackages(packageJson, DRAFT_2020_12_PACKAGES),
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
