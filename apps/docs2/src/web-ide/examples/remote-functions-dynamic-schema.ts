import packageJson from "%/sveltekit-starter/package.json";
import serverTs from "%/sveltekit-starter/src/lib/server.ts?raw";
import layoutTs from "%/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+layout.ts?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+page.svelte?raw";
import dataRemoteTs from "%/sveltekit-starter/src/routes/remote-functions-dynamic-schema/data.remote.ts?raw";
import nestedPageSvelte from "%/sveltekit-starter/src/routes/remote-functions-dynamic-schema/[id]/+page.svelte?raw";

import { FORM_SVELTEKIT_RF_PACKAGE } from "@/shared";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  formDefaults: {
    idBuilderPackage: FORM_SVELTEKIT_RF_PACKAGE,
  },
  files: {
    "src/lib/server.ts": serverTs,
    "src/routes/+layout.ts": layoutTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/[id]/+page.svelte": nestedPageSvelte,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@sjsf/form", "@sjsf/sveltekit/rf/client"],
    },
  },
} satisfies Layer;
