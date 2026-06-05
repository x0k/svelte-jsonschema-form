import sveltePage from "examples/basic-starter/src/routes/preupload-file/+page.svelte?raw";
import nestedSveltePage from "examples/basic-starter/src/routes/preupload-file/[id]/+page.svelte?raw";
import contextTs from "examples/basic-starter/src/routes/preupload-file/context.ts?raw";
import svelteFrom from "examples/basic-starter/src/routes/preupload-file/form.svelte?raw";
import svelteStoredFileField from "examples/basic-starter/src/routes/preupload-file/stored-file-field.svelte?raw";

import { defineExample, defineMeta, Tag, ExampleCategory } from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.LayoutAndComponents,
  title: "Pre-upload File",
  description:
    "Custom file upload widget with client-side preview before submission.",
  tags: [Tag.CustomComponent],
});

export default defineExample({
  widgets: ["file"],
  files: {
    "src/routes/+page.svelte": sveltePage,
    "src/routes/[id]/+page.svelte": nestedSveltePage,
    "src/routes/context.ts": contextTs,
    "src/routes/form.svelte": svelteFrom,
    "src/routes/stored-file-field.svelte": svelteStoredFileField,
  },
});
