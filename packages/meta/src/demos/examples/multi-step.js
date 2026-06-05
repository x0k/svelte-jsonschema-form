import pageSvelte from "examples/basic-starter/src/routes/multi-step/+page.svelte?raw";
import multiStepFieldSvelte from "examples/basic-starter/src/routes/multi-step/multi-step-field.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LayoutAndComponents,
  title: "Multi-step",
  description: "Multi-step wizard form with navigation.",
  tags: [Tag.Layout],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/multi-step-field.svelte": multiStepFieldSvelte,
  },
});
