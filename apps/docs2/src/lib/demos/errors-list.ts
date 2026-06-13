import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/errors-list/+page.svelte";
import demoSchemasTs from "../../demos/demo-schemas.ts?raw";
import pageSvelte from "../../demos/errors-list/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/demo-schemas.ts": demoSchemasTs,
};
const meta: DemoMeta = {};
export default { files, Component: PageComponent, meta } satisfies DemoData;
