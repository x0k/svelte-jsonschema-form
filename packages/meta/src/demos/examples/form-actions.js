import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import pageServerTs from "examples/sveltekit-starter/src/routes/form-actions/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/form-actions/+page.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Form Actions",
  description: "JSON Schema forms integrated with SvelteKit form actions.",
  tags: [Tag.FormActions, Tag.SvelteKit],
});

export default defineExample({
  sveltekit: "formActions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
