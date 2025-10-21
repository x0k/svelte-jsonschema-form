import packageJson from "%/sveltekit-starter/package.json";
import postModelTs from '%/sveltekit-starter/src/lib/post-model.ts?raw';
import dataRemoteTs from "%/sveltekit-starter/src/routes/remote-functions/data.remote?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/remote-functions/+page.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/lib/post-model.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
