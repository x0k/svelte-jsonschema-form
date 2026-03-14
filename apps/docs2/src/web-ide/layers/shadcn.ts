import packageJson from "examples/shadcn-starter/package.json";
import appCss from "examples/shadcn-starter/src/app.css?raw";
import componentsJson from "examples/shadcn-starter/components.json?raw";
import utilsTs from "examples/shadcn-starter/src/lib/utils?raw";
import layoutSvelte from "examples/shadcn-starter/src/routes/+layout.svelte?raw";
import tailwindConfigJs from "examples/shadcn-starter/tailwind.config.js?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "shadcn" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/lib/utils.ts": utilsTs,
    "src/app.css": appCss,
    "components.json": componentsJson,
    "tailwind.config.js": tailwindConfigJs,
  },
} satisfies Layer;
