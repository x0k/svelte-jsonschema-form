import { defineAddon } from "sv";

import { createPrinter } from "./sv-utils.js";
import { options, type Context } from "./model.js";
import { defaultsTs } from "./defaults.js";
import { dependencies } from "./dependencies.js";
import { appCss } from "./styles.js";
import { shadcnTs } from "./shadcn.js";
import { svelteKit } from "./sveltekit.js";

export default defineAddon({
  id: "@sjsf/sv",
  options,

  // setup: ({ isKit, unsupported }) => {
  // 	if (!isKit) unsupported('Requires SvelteKit');
  // },

  run: (ws) => {
    const { language } = ws;
    const isTs = language === "ts";
    const [ts] = createPrinter(isTs);

    const ctx: Context = {
      ...ws,
      isTs,
      ts: ts!,
    };

    dependencies(ctx);
    defaultsTs(ctx);
    shadcnTs(ctx);
    appCss(ctx);
    svelteKit(ctx);
  },
});
