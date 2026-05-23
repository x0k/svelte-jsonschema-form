import tailwindConfigJs from "examples/flowbite-starter/tailwind.config.js?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: themeDependencies("flowbite"),
  },
  formDefaults: { theme: "flowbite" },
  files: {
    "tailwind.config.js": tailwindConfigJs,
  },
  svelte: {
    compilerOptions: {
      runes: false,
    },
  },
});
