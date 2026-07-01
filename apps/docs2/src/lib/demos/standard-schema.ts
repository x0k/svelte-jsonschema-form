import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/standard-schema/+page.svelte";
import pageSvelte from "../../demos/standard-schema/+page.svelte?raw";
import demoSchemaTs from "../../demos/demo-schema.ts?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/demo-schema.ts": demoSchemaTs,
};
const meta: DemoMeta = {
  "validator": {
    "name": "standard-schema",
    "draft2020": false,
    "precompiled": false
  },
  "extraDependencies": [
    {
      "name": "json-schema-to-ts",
      "version": "3.1.1",
      "dev": true
    },
    {
      "name": "arktype",
      "version": "2.2.1",
      "dev": false
    }
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
