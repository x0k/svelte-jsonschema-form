import appCss from "examples/flowbite3-starter/src/app.css?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: themeDependencies("flowbite3"),
  },
  formDefaults: { theme: "flowbite3" },
  files: {
    "src/app.css": appCss,
  },
});
