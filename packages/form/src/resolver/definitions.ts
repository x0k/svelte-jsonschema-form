import type { ComponentDefinitions } from "@/form/components.js";

import * as fields from "../fields/exports.js";
import * as templates from "../templates/exports.js";

export interface ExtraComponents {}

export const definitions = Object.assign(
  {},
  fields,
  templates
) satisfies Partial<ComponentDefinitions> as typeof fields &
  typeof templates &
  Pick<ComponentDefinitions, keyof ExtraComponents>;
