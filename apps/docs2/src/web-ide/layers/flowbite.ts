import packageJson from "%/flowbite-starter/package.json";
import tailwindConfigJs from "%/flowbite-starter/tailwind.config.js?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: { theme: "flowbite" },
  files: {
    "tailwind.config.js": tailwindConfigJs,
  },
  svelte: {
    compilerOptions: {
      runes: false,
    },
  },
} satisfies Layer;
