import countriesTs from "examples/basic-starter/src/routes/remote-enum/countries.ts?raw";
import pageSvelte from "examples/basic-starter/src/routes/remote-enum/+page.svelte?raw";
import comboboxSvelte from "examples/basic-starter/src/routes/remote-enum/combobox.svelte?raw";

import { defineLayer } from "meta/composer";

export default defineLayer({
  package: {
    name: "remote-enum",
  },
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": comboboxSvelte,
  },
});
