import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";

import { extraPackage } from "meta";

import { defineExample } from "../shared.js";

export default defineExample({
  dependencies: [extraPackage("jsonSchemaTyped")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
