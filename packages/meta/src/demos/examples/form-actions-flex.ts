import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Form Actions Flex",
  description: "Flexible form actions for different submission patterns.",
  category: ExampleCategory.FormActions,
});

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
