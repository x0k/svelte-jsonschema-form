import type { ComponentDefinitions } from "@/form/index.js";

import * as fields from "../exports.js";

const definitions = Object.assign({}, fields);

export const extendable: Partial<ComponentDefinitions> = definitions;
