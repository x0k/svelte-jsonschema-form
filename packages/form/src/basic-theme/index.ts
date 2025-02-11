import { fromRecord } from "@/lib/resolver.js";
import type { ThemeResolver } from "@/form/theme.js";

import * as fields from "@/fields/index.js";
import * as templates from "@/templates/index.js";

import * as components from "./components/index.js";
import * as widgets from "./widgets/index.js";

export const theme: ThemeResolver = fromRecord({
  ...fields,
  ...templates,
  ...components,
  ...widgets,
});
