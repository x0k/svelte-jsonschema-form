import pageSvelte from "examples/basic-starter/src/routes/enum-widgets/+page.svelte?raw";
import radioWithOrderSvelte from "examples/basic-starter/src/routes/enum-widgets/radio-with-other.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Enum Widgets",
  description: "Different widget types for enum properties.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/radio-with-other.svelte": radioWithOrderSvelte,
  },
});
