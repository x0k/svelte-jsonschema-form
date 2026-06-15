import serverTs from "examples/sveltekit-starter/src/lib/server.ts?raw";
import layoutServerTs from "examples/sveltekit-starter/src/routes/form-actions-dynamic-schema/+layout.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions-dynamic-schema/+page.svelte?raw";
import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions-dynamic-schema/[id]/+page.server.ts?raw";
import nestedPageSvelte from "examples/sveltekit-starter/src/routes/form-actions-dynamic-schema/[id]/+page.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Form Actions Dynamic Schema",
  description: "Dynamic schemas combined with SvelteKit form actions.",
  tags: [Tag.FormActions],
});

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/lib/server.ts": serverTs,
    "src/routes/+layout.server.ts": layoutServerTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/[id]/+page.server.ts": pageServerTs,
    "src/routes/[id]/+page.svelte": nestedPageSvelte,
  },
});
