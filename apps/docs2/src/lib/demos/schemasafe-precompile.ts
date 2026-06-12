import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/schemasafe-precompile/+page.svelte";
import inputSchemaJson from "../../demos/input-schema.json?raw";
import pageSvelte from "../../demos/schemasafe-precompile/+page.svelte?raw";
import compileSchemaScriptTs from "../../demos/schemasafe-precompile/compile-schema-script.ts?raw";
import patchedSchemaTs from "../../demos/schemasafe-precompile/patched-schema.ts?raw";
import validateFunctionsJs from "../../demos/schemasafe-precompile/validate-functions.js?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/routes/compile-schema-script.ts": compileSchemaScriptTs,
  "src/input-schema.json": inputSchemaJson,
  "src/routes/patched-schema.ts": patchedSchemaTs,
  "src/routes/validate-functions.js": validateFunctionsJs,
};

export default { files, Component: PageComponent } satisfies DemoData;
