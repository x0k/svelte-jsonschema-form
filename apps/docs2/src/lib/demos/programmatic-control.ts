import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/programmatic-control/+page.svelte";
import pageSvelte from "../../demos/programmatic-control/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
