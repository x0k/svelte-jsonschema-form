import type { ProjectFiles } from "../../project";

import ppageSvelte from "./src/routes/+page.svelte?raw";
import appHtml from "./src/app.html?raw";
import packageJson from "./package.json?raw";
import svelteConfigJs from "./svelte.config.js.txt?raw";
import tsconfigJson from "./tsconfig.json?raw";
import viteConfigTs from "./vite.config.ts.txt?raw";

export const files: ProjectFiles = {
  "src/routes/+page.svelte": ppageSvelte,
  "src/app.html": appHtml,
  "package.json": packageJson,
  "svelte.config.js": svelteConfigJs,
  "tsconfig.json": tsconfigJson,
  "vite.config.ts": viteConfigTs,
};
