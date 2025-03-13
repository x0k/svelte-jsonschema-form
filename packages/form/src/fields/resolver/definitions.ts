import type { ComponentDefinitions } from "@/form/index.js";

import * as fields from "../exports.js";

export interface ExtraFields {}

export const definitions = Object.assign(
  {},
  fields
) satisfies Partial<ComponentDefinitions> as typeof fields &
  Pick<ComponentDefinitions, keyof ExtraFields>;
