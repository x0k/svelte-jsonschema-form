import pageSvelte from "examples/basic-starter/src/routes/formulas/+page.svelte?raw";
import objectFieldSvelte from "examples/basic-starter/src/routes/formulas/object-field.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SchemaAndValidation,
  title: "Formulas",
  description:
    "Custom field component with its own logic (formula-based values).",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/object-field.svelte": objectFieldSvelte,
  },
});
