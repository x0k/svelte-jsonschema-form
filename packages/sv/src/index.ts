import { defineAddon } from "sv";

import { createContext, options } from "./model.js";
import { defaultsTs } from "./defaults.js";
import { dependencies } from "./dependencies.js";
import { appCss } from "./styles.js";
import { shadcnTs } from "./shadcn.js";
import { postTs } from "./post.js";
import { svelteKit } from "./sveltekit.js";
import { scriptsFolder } from "./scripts.js";

export default defineAddon({
  id: "@sjsf/sv",
  options,

  // setup: ({ isKit, unsupported }) => {
  // 	if (!isKit) unsupported('Requires SvelteKit');
  // },

  run: (ws) => {
    const ctx = createContext(ws);
    dependencies(ctx);
    defaultsTs(ctx);
    shadcnTs(ctx);
    appCss(ctx);
    postTs(ctx);
    scriptsFolder(ctx);
    svelteKit(ctx);
  },
});
