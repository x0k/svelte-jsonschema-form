import sveltePage from "examples/basic-starter/src/routes/arktype-starter/+page.svelte?raw";
import { extraPackage } from "meta";

import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.Starters,
  title: "Arktype Starter",
  description: "Arktype with standard-schema validator starter.",
  tags: [],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "noop",
  dependencies: [extraPackage("arktype")],
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
