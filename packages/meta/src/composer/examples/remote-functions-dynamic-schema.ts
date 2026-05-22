import serverTs from "examples/sveltekit-starter/src/lib/server.ts?raw";
import layoutTs from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+layout.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+page.svelte?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/data.remote.ts?raw";
import nestedPageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/[id]/+page.svelte?raw";

import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    name: "remote-functions-dynamic-schema",
  },
  files: {
    "src/lib/server.ts": serverTs,
    "src/routes/+layout.ts": layoutTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/[id]/+page.svelte": nestedPageSvelte,
  },
});
