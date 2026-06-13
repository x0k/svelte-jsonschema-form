import { type DemoData, cleanPage } from "../demo.ts";
import PageComponent from "../../demos/usage-form/+page.svelte";
import createUserTs from "../../demos/create-user.ts?raw";
import pageSvelte from "../../demos/usage-form/+page.svelte?raw";

const files: Record<string, string> = {
  "src/routes/+page.svelte": cleanPage(pageSvelte),
  "src/create-user.ts": createUserTs,
};

export default { files, Component: PageComponent } satisfies DemoData;
