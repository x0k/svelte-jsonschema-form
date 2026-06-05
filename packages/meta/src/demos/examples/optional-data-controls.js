import sveltePage from "examples/basic-starter/src/routes/optional-data-controls/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Optional Data Controls",
  description: "Controlling optional field behavior and appearance.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
