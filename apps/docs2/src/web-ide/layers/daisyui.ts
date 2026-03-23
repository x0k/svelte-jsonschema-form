import packageJson from "examples/daisyui-starter/package.json";
import tailwindConfigJs from "examples/daisyui-starter/tailwind.config.js?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "daisyui" },
  files: {
    "tailwind.config.js": tailwindConfigJs,
  },
} satisfies Layer;
