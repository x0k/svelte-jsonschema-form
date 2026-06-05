import sveltePage from "examples/basic-starter/src/routes/label-on-left/+page.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Label on Left",
  description: "Field labels rendered on the left side.",
  tags: [Tag.Layout],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
