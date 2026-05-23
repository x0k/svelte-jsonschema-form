import appCss from "examples/skeleton3-starter/src/app.css?raw";
import appHtml from "examples/skeleton3-starter/src/app.html?raw";

import { optionalPackageName } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: themeDependencies("skeleton3", [
      optionalPackageName("skeletonSvelte"),
    ]),
  },
  formDefaults: { theme: "skeleton3" },
  files: {
    "src/app.css": appCss,
    "src/app.html": appHtml,
  },
});
