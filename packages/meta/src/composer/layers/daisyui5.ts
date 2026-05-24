import appCss from "examples/daisyui5-starter/src/app.css?raw";

import { optionalPackageName } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(
      themeDependencies("daisyui5", [optionalPackageName("pikaday")]),
    ),
  },
  formDefaults: { theme: "daisyui5" },
  files: {
    "src/app.css": appCss,
  },
});
