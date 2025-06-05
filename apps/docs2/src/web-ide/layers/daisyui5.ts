import packageJson from "%/daisyui5-starter/package.json";
import appCss from "%/daisyui5-starter/src/app.css?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "daisyui5" },
  files: {
    "src/app.css": appCss,
  },
} satisfies Layer;
