import sveltePage from "examples/basic-starter/src/routes/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.GettingStarted,
  title: "Starter",
  description: "Basic JSON Schema form setup with Svelte.",
  tags: [],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
