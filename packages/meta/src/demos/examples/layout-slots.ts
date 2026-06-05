import pageSvelte from "examples/basic-starter/src/routes/layout-slots/+page.svelte?raw";
import layoutSvelte from "examples/basic-starter/src/routes/layout-slots/layout.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Layout Slots",
  description: "Form layout customization using slot-based components.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/layout.svelte": layoutSvelte,
  },
});
