import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/dependencies/+page.svelte";
import pageSvelte from "../../demos/dependencies/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "fields": [
    "enum"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
