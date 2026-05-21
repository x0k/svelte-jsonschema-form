import appCss from "examples/daisyui-starter/src/app.css?raw";
import layoutSvelte from "examples/daisyui-starter/src/routes/+layout.svelte?raw";
import postcssConfigJs from "examples/daisyui-starter/postcss.config.js?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: [extraPackage("tailwindcss3"), extraPackage("postcss")],
  },
  files: {
    "src/app.css": appCss,
    "src/routes/+layout.svelte": layoutSvelte,
    "postcss.config.js": postcssConfigJs,
  },
});
