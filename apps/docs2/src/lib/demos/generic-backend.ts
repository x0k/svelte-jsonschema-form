import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/generic-backend/+page.svelte";
import pageSvelte from "../../demos/generic-backend/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "widgets": [
    "radio"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
