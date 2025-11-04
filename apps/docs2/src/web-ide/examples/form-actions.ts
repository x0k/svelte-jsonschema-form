import packageJson from "%/sveltekit-starter/package.json";
import postModelTs from '%/sveltekit-starter/src/lib/post.ts?raw';
import pageServerTs from "%/sveltekit-starter/src/routes/form-actions/+page.server.ts?raw";
import pageSvelte from "%/sveltekit-starter/src/routes/form-actions/+page.svelte?raw";

import { omitBasePackages, type Layer } from "../layer";

export const layer = {
  package: omitBasePackages(packageJson),
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
  },
} satisfies Layer;
