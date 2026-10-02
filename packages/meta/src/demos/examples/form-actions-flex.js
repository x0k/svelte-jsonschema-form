import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-flex/+page.svelte?raw";

import {
  ExampleCategory,
  KIT2_DEMO_RANGE,
  Tag,
  defineExample,
  defineMeta,
} from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Form Actions Flex",
  description: "Flexible form actions for different submission patterns.",
  tags: [Tag.FormActions],
});

export default defineExample({
  kitRange: KIT2_DEMO_RANGE,
  sveltekit: "formActions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
  widgets: ["textarea"],
});
