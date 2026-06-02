import pageSvelte from "examples/basic-starter/src/routes/enum-widgets/+page.svelte?raw";
import radioWithOrderSvelte from "examples/basic-starter/src/routes/enum-widgets/radio-with-other.svelte?raw";

import { defineExample } from "../shared.js";

export default defineExample({
  files: {
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/radio-with-other.svelte": radioWithOrderSvelte,
  },
});
