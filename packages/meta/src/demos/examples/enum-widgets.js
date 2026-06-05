import pageSvelte from "examples/basic-starter/src/routes/enum-widgets/+page.svelte?raw";
import radioWithOrderSvelte from "examples/basic-starter/src/routes/enum-widgets/radio-with-other.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Enum Widgets",
  description: "Different widget types for enum properties.",
  tags: [Tag.Enum, Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/radio-with-other.svelte": radioWithOrderSvelte,
  },
});
