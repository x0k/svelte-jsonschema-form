import packageJson from "%/shadcn-starter/package.json";
import appCss from "%/shadcn-starter/src/app.css?raw";
import componentsJson from "%/shadcn-starter/components.json?raw";
import utilsTs from "%/shadcn-starter/src/lib/utils?raw";
import layoutSvelte from "%/shadcn-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "shadcn" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/lib/utils.ts": utilsTs,
    "src/app.css": appCss,
    "components.json": componentsJson,
  },
} satisfies Layer;
