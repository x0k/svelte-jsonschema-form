import packageJson from "%/multi-step-native-form/package.json";
import pageServerTs from "%/multi-step-native-form/src/routes/+page.server.ts?raw";
import pageSvelte from "%/multi-step-native-form/src/routes/+page.svelte?raw";
import modelTs from "%/multi-step-native-form/src/routes/model.ts?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/model.ts": modelTs,
  },
} satisfies Layer;
