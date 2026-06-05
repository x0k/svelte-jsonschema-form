import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions/data.remote?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions/+page.svelte?raw";

import {
  defineExample,
  defineMeta,
  remoteFormDefaultsReplacer,
  Tag,
} from "../model.js";

export const meta = defineMeta({
  title: "Remote Functions",
  description: "SvelteKit remote functions for server-side logic.",
  tags: [Tag.RemoteFunctions, Tag.SvelteKit],
});

export default defineExample({
  sveltekit: "remoteFunctions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
  },
  codeTransformers: [remoteFormDefaultsReplacer],
});
