import countriesTs from "examples/basic-starter/src/routes/remote-enum/countries.ts?raw";
import pageSvelte from "examples/basic-starter/src/routes/remote-enum/+page.svelte?raw";
import comboboxSvelte from "examples/basic-starter/src/routes/remote-enum/combobox.svelte?raw";

import { defineExample, defineMeta, ExampleCategory } from "../model.ts";

export const meta = defineMeta({
  title: "Remote Enum",
  description: "Async enum options loaded from a remote source.",
  category: ExampleCategory.Generic,
});

export default defineExample({
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": comboboxSvelte,
  },
});
