import sveltePage from "examples/basic-starter/src/routes/arktype-starter/+page.svelte?raw";

import { extraPackage } from "meta";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Arktype Starter",
  description: "Arktype with standard-schema validator starter.",
  category: ExampleCategory.ValidatorSpecific,
});

export default defineExample({
  validator: "noop",
  dependencies: [extraPackage("arktype")],
  files: {
    "src/routes/+page.svelte": sveltePage,
  },
});
