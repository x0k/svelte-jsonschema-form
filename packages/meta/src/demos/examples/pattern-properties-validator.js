import pageSvelte from "examples/basic-starter/src/routes/pattern-properties-validator/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LogicExtension,
  title: "Pattern Properties Validator",
  description:
    "Custom field component with validation logic for patternProperties.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
