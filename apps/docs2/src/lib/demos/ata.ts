import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/ata/+page.svelte";
import pageSvelte from "../../demos/ata/+page.svelte?raw";
import demoSchemaTs from "../../demos/demo-schema.ts?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/demo-schema.ts": demoSchemaTs,
};
const meta: DemoMeta = {};
export default { files, Component: PageComponent, meta } satisfies DemoData;
