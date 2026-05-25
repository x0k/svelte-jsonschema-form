import pageSvelte from "examples/basic-starter/src/routes/typebox-starter/+page.svelte?raw";
import standardTs from "examples/basic-starter/src/lib/standard.ts?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "typebox-starter",
    dependencies: [extraPackage("typebox")],
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/lib/standard.ts": standardTs,
  },
});
