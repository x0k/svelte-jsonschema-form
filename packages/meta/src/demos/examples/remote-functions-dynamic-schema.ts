import serverTs from "examples/sveltekit-starter/src/lib/server.ts?raw";
import layoutTs from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+layout.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/+page.svelte?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/data.remote.ts?raw";
import nestedPageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-dynamic-schema/[id]/+page.svelte?raw";

import {
  defineExample,
  defineMeta,
  remoteFormDefaultsReplacer,
  ExampleCategory,
} from "../model.ts";

export const meta = defineMeta({
  title: "Remote Functions Dynamic Schema",
  description: "Dynamic schemas combined with SvelteKit remote functions.",
  category: ExampleCategory.RemoteFunctions,
});

export default defineExample({
  sveltekit: "remoteFunctions",
  files: {
    "src/lib/server.ts": serverTs,
    "src/routes/+layout.ts": layoutTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/[id]/+page.svelte": nestedPageSvelte,
  },
  codeTransformers: [remoteFormDefaultsReplacer],
});
