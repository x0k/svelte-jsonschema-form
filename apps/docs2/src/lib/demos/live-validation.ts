import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/live-validation/+page.svelte";
import pageSvelte from "../../demos/live-validation/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
