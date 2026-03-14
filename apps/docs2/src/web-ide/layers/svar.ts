import packageJson from "examples/svar-starter/package.json";
import layoutSvelte from "examples/svar-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "svar" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
} satisfies Layer;
