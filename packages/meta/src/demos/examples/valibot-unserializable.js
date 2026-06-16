import unknownBigIntFieldSvelte from "examples/basic-starter/src/lib/unknown-big-int-field.svelte?raw";
import unknownDateFieldSvelte from "examples/basic-starter/src/lib/unknown-date-field.svelte?raw";
import sveltePage from "examples/basic-starter/src/routes/valibot-unserializable/+page.svelte?raw";

import { defineExample, defineMeta, ExampleCategory, Tag } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LogicExtension,
  title: "Valibot Unserializable",
  description:
    "Valibot schema with unrepresentable types (Date, BigInt) handled via custom fields.",
  tags: [Tag.CustomComponent],
  isValidatorSpecific: true,
});

export default defineExample({
  validator: "valibot",
  files: {
    "src/routes/+page.svelte": sveltePage,
    "src/lib/unknown-date-field.svelte": unknownDateFieldSvelte,
    "src/lib/unknown-big-int-field.svelte": unknownBigIntFieldSvelte,
  },
});
