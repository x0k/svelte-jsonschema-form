import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";
import { extraPackage } from "meta";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LogicExtension,
  title: "Draft 2020-12",
  description: "JSON Schema draft 2020-12 features including $ref.",
  tags: [Tag.Schema],
});

export default defineExample({
  dependencies: [extraPackage("jsonSchemaTyped")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
