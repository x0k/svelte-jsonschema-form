import appCss from "examples/shadcn-extras-starter/src/app.css?raw";
import componentsJson from "examples/shadcn-extras-starter/components.json?raw";
import layoutSvelte from "examples/shadcn-extras-starter/src/routes/+layout.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: [
      ...themeDependencies("shadcn-extras", true),
      extraPackage("twAnimateCss"),
    ],
  },
  formDefaults: { theme: "shadcn-extras" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/app.css": appCss,
    "components.json": componentsJson,
  },
  vite: {
    resolve: {
      noExternal: ["@lucide/svelte"],
    },
  },
});
