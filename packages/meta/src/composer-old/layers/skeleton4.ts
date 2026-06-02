import appCss from "examples/skeleton4-starter/src/app.css?raw";
import appHtml from "examples/skeleton4-starter/src/app.html?raw";

import { optionalPackageName } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(
      themeDependencies("skeleton4", [optionalPackageName("skeletonSvelte")]),
    ),
  },
  formDefaults: { theme: "skeleton4" },
  files: {
    "src/app.css": appCss,
    "src/app.html": appHtml,
  },
});
