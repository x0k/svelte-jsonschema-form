import packageJson from "%/flowbite3-starter/package.json";
import appCss from "%/flowbite3-starter/src/app.css?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "flowbite3" },
  files: {
    "src/app.css": appCss,
  },
} satisfies Layer;
