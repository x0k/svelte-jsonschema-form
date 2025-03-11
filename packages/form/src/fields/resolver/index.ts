import { fromRecord } from "@/lib/resolver.js";
import type { ExtendableComponentDefinitions } from "@/form/index.js";

import "../exports.js";

import { definitions } from "./definitions.js";

export const fields = fromRecord(definitions);

export type ExtendableComponentDefinitionsWithoutFields = Omit<
  ExtendableComponentDefinitions,
  keyof typeof definitions
>;
