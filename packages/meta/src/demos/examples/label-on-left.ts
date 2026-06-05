import sveltePage from "examples/basic-starter/src/routes/label-on-left/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Label on Left",
  description: "Field labels rendered on the left side.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
