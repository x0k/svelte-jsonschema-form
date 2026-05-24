import appCss from "examples/flowbite3-starter/src/app.css?raw";

import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(themeDependencies("flowbite3")),
  },
  formDefaults: { theme: "flowbite3" },
  files: {
    "src/app.css": appCss,
  },
});
