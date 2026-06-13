import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions-enhance/data.remote?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-enhance/+page.svelte?raw";

import {
  defineExample,
  defineMeta,
  remoteFormDefaultsReplacer,
  Tag,
  ExampleCategory,
} from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Remote Functions Enhance",
  description: "Progressively enhanced remote functions.",
  tags: [Tag.RemoteFunctions],
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
