import { createTheme } from "@/form/theme.js";
import * as fields from "@/fields/index.js";
import * as templates from "@/templates/index.js";

import * as components from "./components/index.js";
import * as widgets from "./widgets/index.js";

export { fields, templates, components, widgets };

export const theme = createTheme({
  ...fields,
  ...templates,
  ...components,
  ...widgets,
});
