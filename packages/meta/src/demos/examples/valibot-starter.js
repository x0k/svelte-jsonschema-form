import pageSvelte from "examples/basic-starter/src/routes/valibot-starter/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.GettingStarted,
  title: "Valibot Starter",
  description: "Valibot validator integration starter.",
  tags: [],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "valibot",
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
