import { defineAddon } from "sv";

import { defaultsTs } from "./defaults.js";
import { dependencies } from "./dependencies.js";
import {
  createContext,
  createOptions,
  type AddonSetupOptions,
} from "./model.js";
import { pageSvelte } from "./page.js";
import { postTs } from "./post.js";
import { scriptsFolder } from "./scripts.js";
import { shadcnTs } from "./shadcn.js";
import { appCss } from "./styles.js";
import { color } from "./sv-utils.js";
import { sveltekitTs } from "./sveltekit.js";
import { viteConfig } from "./vite.js";

const addonOptions: AddonSetupOptions = {
  isKit: false,
};

export default defineAddon({
  id: "@sjsf/sv",
  options: createOptions(addonOptions),
  shortDescription: "forms library",
  homepage: "https://x0k.github.io/svelte-jsonschema-form/",

  setup: ({ isKit }) => {
    Object.assign(addonOptions, {
      isKit,
    } satisfies AddonSetupOptions);
  },

  run: async (ws) => {
    const ctx = createContext(ws);
    dependencies(ctx);
    defaultsTs(ctx);
    shadcnTs(ctx);
    appCss(ctx);
    await postTs(ctx);
    scriptsFolder(ctx);
    viteConfig(ctx);
    sveltekitTs(ctx);
    pageSvelte(ctx);
  },

  nextSteps({ isKit, directory }) {
    const steps: string[] = [];
    steps.push(
      `${
        isKit
          ? `Visit ${color.route("/demo/sjsf")} route`
          : `See ${color.route(`${directory.kitRoutes}/sjsf.svelte`)} file`
      } to view the demo`
    );
    return steps;
  },
});
