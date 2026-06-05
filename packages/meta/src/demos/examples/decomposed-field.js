import pageSvelte from "examples/basic-starter/src/routes/decomposed-field/+page.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Decomposed Field",
  description: "Complex field decomposed into reusable sub-components.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
