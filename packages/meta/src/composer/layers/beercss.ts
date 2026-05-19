import packageJson from "examples/beercss-starter/package.json";
import layoutSvelte from "examples/beercss-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer.ts";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "beercss" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
} satisfies Layer;
