import layoutSvelte from "examples/basic-starter/src/routes/+layout.svelte?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: themeDependencies("basic"),
  },
  formDefaults: { theme: "basic" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
});
