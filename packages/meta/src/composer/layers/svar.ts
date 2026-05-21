import layoutSvelte from "examples/svar-starter/src/routes/+layout.svelte?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: themeDependencies("svar"),
  },
  formDefaults: { theme: "svar" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
});
