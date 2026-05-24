import layoutSvelte from "examples/beercss-starter/src/routes/+layout.svelte?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(themeDependencies("beercss")),
  },
  formDefaults: { theme: "beercss" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
});
