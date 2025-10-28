import packageJson from "%/shadcn4-starter/package.json";
import appCss from "%/shadcn4-starter/src/app.css?raw";
import componentsJson from "%/shadcn4-starter/components.json?raw";
import utilsTs from "%/shadcn4-starter/src/lib/utils?raw";
import layoutSvelte from "%/shadcn4-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "shadcn4" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/lib/utils.ts": utilsTs,
    "src/app.css": appCss,
    "components.json": componentsJson,
  },
} satisfies Layer;
