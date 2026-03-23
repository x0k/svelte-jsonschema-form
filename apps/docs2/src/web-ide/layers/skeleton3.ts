import packageJson from "examples/skeleton3-starter/package.json";
import appCss from "examples/skeleton3-starter/src/app.css?raw";
import appHtml from "examples/skeleton3-starter/src/app.html?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "skeleton3" },
  files: {
    "src/app.css": appCss,
    "src/app.html": appHtml,
  },
} satisfies Layer;
