import standardTs from "examples/basic-starter/src/lib/standard.ts?raw";
import pageSvelte from "examples/basic-starter/src/routes/typebox-starter/+page.svelte?raw";

import { extraPackage } from "../../package.js";
import { defineExample, defineMeta, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.Starters,
  title: "TypeBox Starter",
  description: "TypeBox with standard-schema validator starter.",
  tags: [],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "noop",
  dependencies: [extraPackage("typebox")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/lib/standard.ts": standardTs,
  },
});
