import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/action-example/+page.svelte";
import pageSvelte from "../../demos/action-example/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
