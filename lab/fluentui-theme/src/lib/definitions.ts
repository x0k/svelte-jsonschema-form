import type { ComponentDefinitions } from "@sjsf/form";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export interface ExtraWidgets {}

export const definitions = {
  ...components,
  ...widgets,
} satisfies Partial<ComponentDefinitions> as typeof components &
  typeof widgets &
  Pick<ComponentDefinitions, keyof ExtraWidgets>;
