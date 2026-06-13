import pageSvelte from "examples/basic-starter/src/routes/nullable-fields/+page.svelte?raw";
import nullableFieldSvelte from "examples/basic-starter/src/routes/nullable-fields/nullable-field.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LogicExtension,
  title: "Nullable Fields",
  description: "Custom nullable field component for null value states.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/nullable-field.svelte": nullableFieldSvelte,
  },
});
