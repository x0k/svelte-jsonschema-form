import pageSvelte from "examples/basic-starter/src/routes/typebox-starter/+page.svelte?raw";
import standardTs from "examples/basic-starter/src/lib/standard.ts?raw";

import { extraPackage } from "meta";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "TypeBox Starter",
  description: "TypeBox with standard-schema validator starter.",
  tags: [Tag.Starter, Tag.Validator],
});

export default defineExample({
  validator: "noop",
  dependencies: [extraPackage("typebox")],
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/lib/standard.ts": standardTs,
  },
});
