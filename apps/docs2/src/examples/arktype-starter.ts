import sveltePage from "examples/basic-starter/src/routes/arktype-starter/+page.svelte?raw";

import { extraPackage } from "meta";

import { defineExample } from "../shared.js";

export default defineExample({
  dependencies: [extraPackage("arktype")],
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
