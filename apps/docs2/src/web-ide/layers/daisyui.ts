import packageJson from "%/daisyui-starter/package.json";
import tailwindConfigJs from "%/daisyui-starter/tailwind.config.js?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "daisyui" },
  files: {
    "tailwind.config.js": tailwindConfigJs,
  },
} satisfies Layer;
