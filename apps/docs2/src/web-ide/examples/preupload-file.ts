import sveltePage from "%/basic-starter/src/routes/preupload-file/+page.svelte?raw";
import nestedSveltePage from "%/basic-starter/src/routes/preupload-file/[id]/+page.svelte?raw";
import contextTs from "%/basic-starter/src/routes/preupload-file/context.ts?raw";
import svelteFrom from "%/basic-starter/src/routes/preupload-file/form.svelte?raw";
import svelteStoredFileField from "%/basic-starter/src/routes/preupload-file/stored-file-field.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  formDefaults: {
    widgets: ["file"],
  },
  files: {
    "src/routes/+page.svelte": sveltePage,
    "src/routes/[id]/+page.svelte": nestedSveltePage,
    "src/routes/context.ts": contextTs,
    "src/routes/form.svelte": svelteFrom,
    "src/routes/stored-file-field.svelte": svelteStoredFileField,
  },
} satisfies Layer;
