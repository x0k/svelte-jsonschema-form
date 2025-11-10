import packageJson from "%/sveltekit-starter/package.json";
import pageServerTs from "%/sveltekit-starter/src/routes/form-actions-without-js/+page.server.ts?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/form-actions-without-js/+page.svelte?raw";

import { FORM_SVELTEKIT_PACKAGE } from '@/shared';

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: {
    idBuilderPackage: FORM_SVELTEKIT_PACKAGE
  },
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
