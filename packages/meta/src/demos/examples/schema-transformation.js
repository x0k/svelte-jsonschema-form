import sveltePage from "examples/basic-starter/src/routes/schema-transformation/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SchemaAndValidation,
  title: "Schema Transformation",
  description: "JSON Schema transformation before form rendering.",
  tags: [Tag.Schema],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
