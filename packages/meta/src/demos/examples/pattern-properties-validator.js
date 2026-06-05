import pageSvelte from "examples/basic-starter/src/routes/pattern-properties-validator/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Pattern Properties Validator",
  description: "Custom validator for patternProperties.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
