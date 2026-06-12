import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/ajv-precompile/+page.svelte";
import pageSvelte from "../../demos/ajv-precompile/+page.svelte?raw";
import compileSchemaScriptTs from "../../demos/ajv-precompile/compile-schema-script.ts?raw";
import patchedSchemaTs from "../../demos/ajv-precompile/patched-schema.ts?raw";
import validateFunctionsJs from "../../demos/ajv-precompile/validate-functions.js?raw";
import inputSchemaJson from "../../demos/input-schema.json?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/routes/compile-schema-script.ts": compileSchemaScriptTs,
  "src/input-schema.json": inputSchemaJson,
  "src/routes/patched-schema.ts": patchedSchemaTs,
  "src/routes/validate-functions.js": validateFunctionsJs,
};

export default { files, Component: PageComponent } satisfies DemoData;
