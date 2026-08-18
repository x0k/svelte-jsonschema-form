import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/standard-schema-no-json-schema/+page.svelte";
import pageSvelte from "../../demos/standard-schema-no-json-schema/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "validator": {
    "name": "standard-schema",
    "draft2020": false,
    "precompiled": false
  },
  "extraDependencies": [
    {
      "name": "effect",
      "version": "3.22.1",
      "dev": false
    }
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
