import sveltePage from "examples/basic-starter/src/routes/arktype-starter/+page.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "arktype-starter",
    dependencies: [extraPackage("arktype")],
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
