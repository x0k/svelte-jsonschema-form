import packageJson from "examples/shadcn-extras-starter/package.json";
import appCss from "examples/shadcn-extras-starter/src/app.css?raw";
import componentsJson from "examples/shadcn-extras-starter/components.json?raw";
import layoutSvelte from "examples/shadcn-extras-starter/src/routes/+layout.svelte?raw";

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
