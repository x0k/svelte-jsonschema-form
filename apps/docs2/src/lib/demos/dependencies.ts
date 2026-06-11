import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/dependencies/+page.svelte";
import pageSvelte from "../../demos/dependencies/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
