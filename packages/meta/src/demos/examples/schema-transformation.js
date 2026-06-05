import sveltePage from "examples/basic-starter/src/routes/schema-transformation/+page.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Schema Transformation",
  description: "JSON Schema transformation before form rendering.",
  tags: [Tag.SchemaManipulation],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
