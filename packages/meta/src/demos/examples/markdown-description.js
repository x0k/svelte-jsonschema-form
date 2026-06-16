import pageSvelte from "examples/basic-starter/src/routes/markdown-description/+page.svelte?raw";
import descriptionSvelte from "examples/basic-starter/src/routes/markdown-description/description.svelte?raw";

import { extraPackage } from "../../package.js";
import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.UiExtension,
  title: "Markdown Description",
  description: "Rich markdown descriptions using svelte-exmarkdown.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  dependencies: [extraPackage("svelteExmarkdown")],
  files: {
    "src/routes/description.svelte": descriptionSvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
});
