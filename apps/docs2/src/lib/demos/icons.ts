import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/icons/+page.svelte";
import pageSvelte from "../../demos/icons/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "extraDependencies": [
    {
      "name": "@lucide/svelte",
      "version": "1.17.0",
      "dev": false
    }
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
