import countriesTs from "examples/basic-starter/src/routes/async-combobox/countries.ts?raw";
import pageSvelte from "examples/basic-starter/src/routes/async-combobox/+page.svelte?raw";
import asyncComboboxSvelte from "examples/basic-starter/src/routes/async-combobox/async-combobox.svelte?raw";
import asyncComboboxWidgetSvelte from "examples/basic-starter/src/routes/async-combobox/async-combobox-widget.svelte?raw";

import { defineExample, defineMeta, Tag } from "../model.js";

export const meta = defineMeta({
  title: "Async Combobox",
  description: "Custom async combobox widget with search functionality.",
  tags: [Tag.Async, Tag.CustomComponent],
});

export default defineExample({
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": asyncComboboxSvelte,
    "src/routes/async-combobox-widget.svelte": asyncComboboxWidgetSvelte,
  },
});
