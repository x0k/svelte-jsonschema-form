import packageJson from "lab/shadcn-extras-starter/package.json";
import appCss from "lab/shadcn-extras-starter/src/app.css?raw";
import componentsJson from "lab/shadcn-extras-starter/components.json?raw";
import layoutSvelte from "lab/shadcn-extras-starter/src/routes/+layout.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "shadcn-extras" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/app.css": appCss,
    "components.json": componentsJson,
  },
  svelte: {
    compilerOptions: {
      runes: false,
    },
  },
} satisfies Layer;
