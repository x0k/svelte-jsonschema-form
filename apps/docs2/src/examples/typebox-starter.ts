import pageSvelte from "examples/basic-starter/src/routes/typebox-starter/+page.svelte?raw";
import standardTs from "examples/basic-starter/src/lib/standard.ts?raw";

import { extraPackage } from "meta";

import { defineExample } from "../shared.js";

export default defineExample({
  dependencies: [extraPackage("typebox")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/lib/standard.ts": standardTs,
  },
});
