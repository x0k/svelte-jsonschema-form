import sveltePage from "examples/basic-starter/src/routes/zod-starter/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.Starters,
  title: "Zod Starter",
  description: "Zod validator integration starter.",
  tags: [],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "zod4",
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
