import descriptionSvelte from "examples/basic-starter/src/routes/markdown-description/description.svelte?raw";
import pageSvelte from "examples/basic-starter/src/routes/markdown-description/+page.svelte?raw";

import { defineLayer } from "../layer.ts";
import { extraPackage } from "../../package.ts";

export const layer = defineLayer({
  package: {
    name: "markdown-description",
    dependencies: [extraPackage("svelteExmarkdown")],
  },
  files: {
    "src/routes/description.svelte": descriptionSvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
});
