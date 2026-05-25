import sveltePage from "examples/typebox-starter/src/routes/+page.svelte?raw";
import standardTs from "examples/typebox-starter/src/lib/standard.ts?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "typebox-starter",
    dependencies: [extraPackage("typebox")],
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
    "src/lib/standard.ts": standardTs,
  },
});
