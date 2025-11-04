import packageJson from "%/skeleton4-starter/package.json";
import appCss from "%/skeleton4-starter/src/app.css?raw";
import appHtml from "%/skeleton4-starter/src/app.html?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "skeleton4" },
  files: {
    "src/app.css": appCss,
    "src/app.html": appHtml,
  },
} satisfies Layer;
