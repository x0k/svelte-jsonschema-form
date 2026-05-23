import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions/data.remote?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: {
    name: "remote-functions",
  },
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
  },
});
