import sveltePage from "examples/basic-starter/src/routes/deprecated-keyword/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Deprecated Keyword",
  description: "Using the deprecated keyword on form fields.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
