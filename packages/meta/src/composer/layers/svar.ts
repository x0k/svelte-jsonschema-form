import layoutSvelte from "examples/svar-starter/src/routes/+layout.svelte?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(themeDependencies("svar")),
  },
  formDefaults: { theme: "svar" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
});
