import { defineAddon } from "sv";

import { createContext, createOptions, type AddonOptions } from "./model.js";
import { defaultsTs } from "./defaults.js";
import { dependencies } from "./dependencies.js";
import { appCss } from "./styles.js";
import { shadcnTs } from "./shadcn.js";
import { postTs } from "./post.js";
import { sveltekitTs } from "./sveltekit.js";
import { scriptsFolder } from "./scripts.js";
import { pageSvelte } from "./page.js";
import { color } from "./sv-utils.js";

const addonOptions: AddonOptions = {
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
    } satisfies AddonOptions);
  },

  run: (ws) => {
    const ctx = createContext(ws);

    ctx.sv.devDependency("@sveltejs/vite-plugin-svelte", "7.0.0");

    dependencies(ctx);
    defaultsTs(ctx);
    shadcnTs(ctx);
    appCss(ctx);
    postTs(ctx);
    scriptsFolder(ctx);
    sveltekitTs(ctx);
    pageSvelte(ctx);
  },

  nextSteps({ isKit, directory }) {
    const steps: string[] = [];
    steps.push(
      color.warning(
        `The version of the ${color.error("@sveltejs/vite-plugin-svelte")} package has been fixed due to ${color.website("https://github.com/sveltejs/vite-plugin-svelte/issues/1333")}`,
      ),
    );
    steps.push(
      `${
        isKit
          ? `Visit ${color.route("/demo/sjsf")} route`
          : `See ${color.route(`${directory.kitRoutes}/sjsf.svelte`)} file`
      } to view the demo`,
    );
    return steps;
  },
});
