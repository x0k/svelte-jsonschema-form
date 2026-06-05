import sveltePage from "examples/basic-starter/src/routes/+page.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Starter",
  description: "Basic JSON Schema form setup with Svelte.",
  tags: [Tag.Starter],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
