import packageJson from "%/basic-starter/package.json";
import layoutSvelte from "%/basic-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "basic" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  }
} satisfies Layer;
