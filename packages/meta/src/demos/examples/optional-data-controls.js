import sveltePage from "examples/basic-starter/src/routes/optional-data-controls/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SchemaAndValidation,
  title: "Optional Data Controls",
  description: "Controlling optional field behavior and appearance.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
