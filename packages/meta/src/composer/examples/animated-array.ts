import animatedArraySvelte from "examples/basic-starter/src/routes/animated-array/animated-array.svelte?raw";
import pageSvelte from "examples/basic-starter/src/routes/animated-array/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "animated-array",
  },
  files: {
    "src/routes/animated-array.svelte": animatedArraySvelte,
    "src/routes/+page.svelte": pageSvelte,
  },
});
