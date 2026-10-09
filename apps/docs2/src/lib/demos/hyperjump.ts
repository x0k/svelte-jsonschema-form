import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/hyperjump/+page.svelte";
import pageSvelte from "../../demos/hyperjump/+page.svelte?raw";
import compileSchemaScriptTs from "../../demos/hyperjump/compile-schema-script.ts?raw";
import patchedSchemaTs from "../../demos/hyperjump/patched-schema.ts?raw";
import validatorsGeneratedTs from "../../demos/hyperjump/validators.generated.ts?raw";
import inputSchemaJson from "../../demos/input-schema.json?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/routes/compile-schema-script.ts": compileSchemaScriptTs,
  "src/input-schema.json": inputSchemaJson,
  "src/routes/patched-schema.ts": patchedSchemaTs,
  "src/routes/validators.generated.ts": validatorsGeneratedTs,
};
const meta: DemoMeta = {
  "validator": {
    "name": "hyperjump",
    "draft2020": false,
    "precompiled": true
  },
  "fields": [
    "multi-enum"
  ],
  "widgets": [
    "checkboxes"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
