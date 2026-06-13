import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/file-size-validator/+page.svelte";
import pageSvelte from "../../demos/file-size-validator/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "fields": [
    "file"
  ],
  "widgets": [
    "file"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
