import type { ComponentDefinitions } from "@/form/index.js";

import * as templates from "../exports.js";

export interface ExtraTemplates {}

export const definitions = Object.assign(
  {},
  templates
) satisfies Partial<ComponentDefinitions> as typeof templates &
  Pick<ComponentDefinitions, keyof ExtraTemplates>;
