import postModelTs from "examples/sveltekit-starter/src/lib/post.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/remote-functions-without-js/+page.svelte?raw";
import dataRemoteTs from "examples/sveltekit-starter/src/routes/remote-functions-without-js/data.remote?raw";
import formContentSvelte from "examples/sveltekit-starter/src/routes/remote-functions-without-js/form-content.svelte?raw";

import {
  defineExample,
  defineMeta,
  remoteFormDefaultsReplacer,
  Tag,
  ExampleCategory,
} from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Remote Functions Without JS",
  description: "Remote functions with JavaScript disabled.",
  tags: [Tag.RemoteFunctions, Tag.NoJs],
});

export default defineExample({
  sveltekit: "remoteFunctions",
  files: {
    "src/lib/post.ts": postModelTs,
    "src/routes/data.remote.ts": dataRemoteTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/form-content.svelte": formContentSvelte,
  },
  codeTransformers: [remoteFormDefaultsReplacer],
  widgets: ["textarea"],
});
