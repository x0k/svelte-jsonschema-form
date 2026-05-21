import tailwindConfigJs from "examples/daisyui-starter/tailwind.config.js?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: themeDependencies("daisyui"),
  },
  formDefaults: { theme: "daisyui" },
  files: {
    "tailwind.config.js": tailwindConfigJs,
  },
});
