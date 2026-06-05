import pageSvelte from "examples/basic-starter/src/routes/draft-2020-12/+page.svelte?raw";

import { extraPackage } from "meta";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Draft 2020-12",
  description: "JSON Schema draft 2020-12 features including $ref.",
  tags: [Tag.SchemaManipulation],
});

export default defineExample({
  dependencies: [extraPackage("jsonSchemaTyped")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
  },
});
