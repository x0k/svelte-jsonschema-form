import packageJson from "%/async-combobox/package.json";
import countriesTs from "%/async-combobox/src/routes/countries.ts?raw";
import pageSvelte from "%/async-combobox/src/routes/+page.svelte?raw";
import asyncComboboxSvelte from "%/async-combobox/src/routes/async-combobox.svelte?raw";
import asyncComboboxWidgetSvelte from "%/async-combobox/src/routes/async-combobox-widget.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/routes/countries.ts": countriesTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/async-combobox.svelte": asyncComboboxSvelte,
    "src/routes/async-combobox-widget.svelte": asyncComboboxWidgetSvelte,
  },
} satisfies Layer;
