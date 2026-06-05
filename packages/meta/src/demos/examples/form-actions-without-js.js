import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Form Actions Without JS",
  description: "Form actions with JavaScript disabled.",
  tags: [Tag.FormActions, Tag.NoJs],
});

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
