import pageServerTs from "examples/sveltekit-starter/src/routes/multi-step-native-form/+page.server.ts?raw";
import pageSvelte from "examples/sveltekit-starter/src/routes/multi-step-native-form/+page.svelte?raw";
import modelTs from "examples/sveltekit-starter/src/routes/multi-step-native-form/model.ts?raw";

import {
  ExampleCategory,
  KIT2_DEMO_RANGE,
  Tag,
  defineExample,
  defineMeta,
} from "../model.js";

export const meta = defineMeta({
  category: ExampleCategory.SvelteKitIntegrations,
  title: "Multi-step Native Form",
  description: "Multi-step form using native HTML form submission.",
  tags: [Tag.FormActions],
});

export default defineExample({
  kitRange: KIT2_DEMO_RANGE,
  sveltekit: "formActions",
  files: {
    "src/routes/+page.server.ts": pageServerTs,
    "src/routes/+page.svelte": pageSvelte,
    "src/routes/model.ts": modelTs,
  },
});
