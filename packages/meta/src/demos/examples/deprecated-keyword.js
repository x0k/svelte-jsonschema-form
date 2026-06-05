import sveltePage from "examples/basic-starter/src/routes/deprecated-keyword/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SchemaAndValidation,
  title: "Deprecated Keyword",
  description: "Adding support for new JSON Schema keywords like 'deprecated'.",
  tags: [Tag.Schema],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
