import packageJson from "%/native-form/package.json";
import pageServerTs from "%/native-form/src/routes/+page.server.ts?raw";
import pageSvelte from "%/native-form/src/routes/+page.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
