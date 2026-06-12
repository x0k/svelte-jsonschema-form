import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/zod4/+page.svelte";
import demoSchemaTs from "../../demos/demo-schema.ts?raw";
import pageSvelte from "../../demos/zod4/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/demo-schema.ts": demoSchemaTs,
};

export default { files, Component: PageComponent } satisfies DemoData;
