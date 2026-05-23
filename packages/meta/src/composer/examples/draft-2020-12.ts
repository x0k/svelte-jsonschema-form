import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "draft-2020-12",
    dependencies: [extraPackage("jsonSchemaTyped")],
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
