import layoutSvelte from "examples/basic-starter/src/routes/+layout.svelte?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: themeDependencies("basic"),
  },
  formDefaults: { theme: "basic" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
  },
});
