import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/prevent-page-reload/+page.svelte";
import pageSvelte from "../../demos/prevent-page-reload/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
