import pageSvelte from "examples/basic-starter/src/routes/decomposed-field/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Decomposed Field",
  description: "Complex field decomposed into reusable sub-components.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
