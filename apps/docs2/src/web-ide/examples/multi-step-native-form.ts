import packageJson from "%/sveltekit-starter/package.json";
import pageServerTs from "%/sveltekit-starter/src/routes/multi-step-native-form/+page.server.ts?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/multi-step-native-form/+page.svelte?raw";
import modelTs from "%/sveltekit-starter/src/routes/multi-step-native-form/model.ts?raw";

import { FORM_SVELTEKIT_PACKAGE } from '@/shared';

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: {
    idBuilderPackage: FORM_SVELTEKIT_PACKAGE,
  },
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/model.ts": modelTs,
  },
} satisfies Layer;
