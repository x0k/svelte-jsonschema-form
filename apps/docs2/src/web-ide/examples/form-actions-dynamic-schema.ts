import packageJson from "%/sveltekit-starter/package.json";
import serverTs from "%/sveltekit-starter/src/lib/server.ts?raw";
import layoutServerTs from "%/sveltekit-starter/src/routes/form-actions-dynamic-schema/+layout.server.ts?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/form-actions-dynamic-schema/+page.svelte?raw";
import nestedPageSvelte from "%/sveltekit-starter/src/routes/form-actions-dynamic-schema/[id]/+page.svelte?raw";
import pageServerTs from "%/sveltekit-starter/src/routes/form-actions-dynamic-schema/[id]/+page.server.ts?raw";

import { FORM_SVELTEKIT_PACKAGE } from "@/shared";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: {
    idBuilderPackage: FORM_SVELTEKIT_PACKAGE,
  },
  files: {
    "src/lib/server.ts": serverTs,
    "src/routes/+layout.server.ts": layoutServerTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/[id]/+page.server.ts": pageServerTs,
    "src/routes/[id]/+page.svelte": nestedPageSvelte,
  },
} satisfies Layer;
