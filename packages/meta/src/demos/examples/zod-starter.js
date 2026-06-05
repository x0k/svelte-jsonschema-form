import sveltePage from "examples/basic-starter/src/routes/zod-starter/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Zod Starter",
  description: "Zod validator integration starter.",
  category: ExampleCategory.ValidatorSpecific,
});

export default defineExample({
  validator: "zod4",
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
