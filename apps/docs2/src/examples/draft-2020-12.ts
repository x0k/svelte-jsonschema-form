import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";

import { extraPackage } from "meta";
import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "draft-2020-12",
    dependencies: [extraPackage("jsonSchemaTyped")],
  },
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
