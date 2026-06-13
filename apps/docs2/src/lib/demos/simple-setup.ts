import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/simple-setup/+page.svelte";
import pageSvelte from "../../demos/simple-setup/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {};
export default { files, Component: PageComponent, meta } satisfies DemoData;
