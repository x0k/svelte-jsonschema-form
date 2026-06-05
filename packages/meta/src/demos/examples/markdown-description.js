import descriptionSvelte from "examples/basic-starter/src/routes/markdown-description/description.svelte?raw";
import pageSvelte from "examples/basic-starter/src/routes/markdown-description/+page.svelte?raw";

import { extraPackage } from "meta";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  title: "Markdown Description",
  description: "Rich markdown descriptions using svelte-exmarkdown.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  dependencies: [extraPackage("svelteExmarkdown")],
  files: {
    "src/routes/description.svelte": descriptionSvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
});
