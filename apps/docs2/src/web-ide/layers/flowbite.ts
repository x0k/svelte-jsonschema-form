import packageJson from "examples/flowbite-starter/package.json";
import tailwindConfigJs from "examples/flowbite-starter/tailwind.config.js?raw";

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
