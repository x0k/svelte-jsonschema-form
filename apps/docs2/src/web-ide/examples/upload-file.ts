import sveltePage from "%/upload-file/src/routes/+page.svelte?raw";
import nestedSveltePage from "%/upload-file/src/routes/[id]/+page.svelte?raw";
import contextTs from "%/upload-file/src/routes/context.ts?raw";
import svelteFrom from "%/upload-file/src/routes/form.svelte?raw";
import svelteStoredFileField from "%/upload-file/src/routes/stored-file-field.svelte?raw";

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
