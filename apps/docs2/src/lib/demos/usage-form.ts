import { type DemoData, type DemoMeta, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/usage-form/+page.svelte";
import createUserTs from "../../demos/create-user.ts?raw";
import pageSvelte from "../../demos/usage-form/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/create-user.ts": createUserTs,
};
const meta: DemoMeta = {
  "fields": [
    "enum",
    "multi-enum",
    "unknown-native-file"
  ],
  "widgets": [
    "checkboxes",
    "file",
    "radio",
    "textarea",
    "date-picker"
  ]
};
export default { files, Component: PageComponent, meta } satisfies DemoData;
