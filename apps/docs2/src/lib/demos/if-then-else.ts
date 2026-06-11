import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/if-then-else/+page.svelte";
import pageSvelte from "../../demos/if-then-else/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};

export default { files, Component: PageComponent } satisfies DemoData;
