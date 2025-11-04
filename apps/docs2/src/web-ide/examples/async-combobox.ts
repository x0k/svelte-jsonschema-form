import countriesTs from "%/basic-starter/src/routes/async-combobox/countries.ts?raw";
import pageSvelte from "%/basic-starter/src/routes/async-combobox/+page.svelte?raw";
import asyncComboboxSvelte from "%/basic-starter/src/routes/async-combobox/async-combobox.svelte?raw";
import asyncComboboxWidgetSvelte from "%/basic-starter/src/routes/async-combobox/async-combobox-widget.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": asyncComboboxSvelte,
    "src/routes/async-combobox-widget.svelte": asyncComboboxWidgetSvelte,
  },
} satisfies Layer;
