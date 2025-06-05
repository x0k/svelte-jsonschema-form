import contextSvelteTs from "%/tabbed-layout/src/lib/tabs/context.svelte.ts?raw";
import tabsLayoutSvelte from "%/tabbed-layout/src/lib/tabs/layout.svelte?raw";
import schemaTs from "%/tabbed-layout/src/lib/tabs/schema.ts?raw";
import tabsSvelte from "%/tabbed-layout/src/lib/tabs/tabs.svelte?raw";
import focusTs from "%/tabbed-layout/src/lib/tabs/focus.ts?raw";
import tabSvelte from "%/tabbed-layout/src/lib/tabs/tab.svelte?raw";
import tabsIndexTs from "%/tabbed-layout/src/lib/tabs/index.ts?raw";
import subTabsSvelte from "%/tabbed-layout/src/routes/sub-tabs.svelte?raw";
import pageSvelte from "%/tabbed-layout/src/routes/+page.svelte?raw";
import topTabsSvelte from "%/tabbed-layout/src/routes/top-tabs.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  files: {
    "src/lib/tabs/context.svelte.ts": contextSvelteTs,
    "src/lib/tabs/layout.svelte": tabsLayoutSvelte,
    "src/lib/tabs/schema.ts": schemaTs,
    "src/lib/tabs/tabs.svelte": tabsSvelte,
    "src/lib/tabs/focus.ts": focusTs,
    "src/lib/tabs/tab.svelte": tabSvelte,
    "src/lib/tabs/index.ts": tabsIndexTs,
    "src/routes/sub-tabs.svelte": subTabsSvelte,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/top-tabs.svelte": topTabsSvelte,
  },
} satisfies Layer;
