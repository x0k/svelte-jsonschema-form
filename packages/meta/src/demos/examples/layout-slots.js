import pageSvelte from "examples/basic-starter/src/routes/layout-slots/+page.svelte?raw";
import layoutSvelte from "examples/basic-starter/src/routes/layout-slots/layout.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LayoutAndComponents,
  title: "Layout Slots",
  description: "Form layout customization using slot-based components.",
  tags: [Tag.Layout],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
});
