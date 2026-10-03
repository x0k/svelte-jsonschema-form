import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-without-js/+page.svelte?raw";

import {
  ExampleCategory,
  KIT2_DEMO_RANGE,
  Tag,
  defineExample,
  defineMeta,
} from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Form Actions Without JS",
  description: "Form actions with JavaScript disabled.",
  tags: [Tag.FormActions, Tag.NoJs],
});

export default defineExample({
  kitRange: KIT2_DEMO_RANGE,
  sveltekit: "formActions",
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
