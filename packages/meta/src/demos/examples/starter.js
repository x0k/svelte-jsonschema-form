import sveltePage from "examples/basic-starter/src/routes/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Starter",
  description: "Basic JSON Schema form setup with Svelte.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
