import packageJson from "%/sveltekit-starter/package.json";
import postModelTs from "%/sveltekit-starter/src/lib/post.ts?raw";
import dataRemoteTs from "%/sveltekit-starter/src/routes/remote-functions-without-js/data.remote?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/remote-functions-without-js/+page.svelte?raw";
import formContentSvelte from "%/sveltekit-starter/src/routes/remote-functions-without-js/form-content.svelte?raw";

import { FORM_SVELTEKIT_RF_PACKAGE } from '@/shared';

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: {
    idBuilderPackage: FORM_SVELTEKIT_RF_PACKAGE
  },
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/form-content.svelte": formContentSvelte,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@sjsf/form", "@sjsf/sveltekit/rf/client"],
    },
  },
} satisfies Layer;
