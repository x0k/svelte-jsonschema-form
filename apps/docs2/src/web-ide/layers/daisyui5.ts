import { dependencies, devDependencies } from "%/daisyui5-starter/package.json";
import appCss from "%/daisyui5-starter/src/app.css?raw";

import type { Layer } from "../layer";

export const layer = {
  package: { dependencies, devDependencies },
  formDefaults: { theme: "daisyui5" },
  files: {
    "src/app.css": appCss,
  },
} satisfies Layer;
