import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/hyperjump/+page.svelte";
import pageSvelte from "../../demos/hyperjump/+page.svelte?raw";
import astTs from "../../demos/hyperjump/ast.ts?raw";
import compileSchemaScriptTs from "../../demos/hyperjump/compile-schema-script.ts?raw";
import patchedSchemaTs from "../../demos/hyperjump/patched-schema.ts?raw";
import inputSchemaJson from "../../demos/input-schema.json?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/routes/ast.ts": astTs,
  "src/routes/compile-schema-script.ts": compileSchemaScriptTs,
  "src/input-schema.json": inputSchemaJson,
  "src/routes/patched-schema.ts": patchedSchemaTs,
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
