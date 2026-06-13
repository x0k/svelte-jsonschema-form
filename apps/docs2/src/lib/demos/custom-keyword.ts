import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/custom-keyword/+page.svelte";
import pageSvelte from "../../demos/custom-keyword/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
};
const meta: DemoMeta = {
  "fields": [
    "unknown-native-file"
  ],
  "widgets": [
    "file"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
