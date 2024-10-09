import type { Theme } from "@/form/index.js";

import { components } from "./components/index.js";
import { widgets } from "./widgets/index.js";

export const theme = {
  components,
  widgets,
} satisfies Theme;
