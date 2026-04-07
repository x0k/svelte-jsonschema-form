import countriesTs from "examples/basic-starter/src/routes/remote-enum/countries.ts?raw";
import pageSvelte from "examples/basic-starter/src/routes/remote-enum/+page.svelte?raw";
import comboboxSvelte from "examples/basic-starter/src/routes/remote-enum/combobox.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": comboboxSvelte,
  },
} satisfies Layer;
