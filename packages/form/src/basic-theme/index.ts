import type { Theme2 } from "@/form/index.js";
import { fields } from "@/fields/index.js";
import { templates } from "@/templates/index.js";

import { components } from "./components/index.js";
import { widgets } from "./widgets/index.js";

export const theme = {
  components,
  widgets,
  fields,
  templates,
} satisfies Theme2;
