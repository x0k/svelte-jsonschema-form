import postModelTs from "examples/sveltekit3-starter/src/lib/post.ts?raw";
import pageServerTs from "examples/sveltekit3-starter/src/routes/form-actions-flex/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit3-starter/src/routes/form-actions-flex/+page.svelte?raw";

import { ExampleCategory, Tag, defineExample, defineMeta } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Form Actions Flex",
  description: "Flexible form actions for different submission patterns.",
  tags: [Tag.FormActions],
});

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
  widgets: ["textarea"],
});
