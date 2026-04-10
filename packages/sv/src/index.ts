import { defineAddon } from "sv";

import { createPrinter } from "./sv-utils.js";
import { options, type Context } from "./model.js";
import { defaultsTs } from "./defaults.js";

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

    defaultsTs(ctx);
  },
});
