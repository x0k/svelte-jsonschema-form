import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/ui-schema/+page.svelte";
import pageSvelte from "../../demos/ui-schema/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
