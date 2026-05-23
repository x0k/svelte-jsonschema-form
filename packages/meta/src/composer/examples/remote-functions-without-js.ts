import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions-without-js/data.remote?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-without-js/+page.svelte?raw";
import formContentSvelte from "examples/sveltekit-starter/src/routes/remote-functions-without-js/form-content.svelte?raw";

import { defineLayer } from "../layer.ts";

export default defineLayer({
  package: { name: "remote-functions-without-js" },
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/form-content.svelte": formContentSvelte,
  },
});
