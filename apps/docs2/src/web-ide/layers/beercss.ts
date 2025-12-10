import packageJson from "%/beercss-starter/package.json";
import layoutSvelte from "%/beercss-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "beercss" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
} satisfies Layer;
