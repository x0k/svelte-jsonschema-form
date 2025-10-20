import { fromRecord } from "@/lib/resolver.js";

import "../fields/exports.js";
import "../templates/exports.js";

import { definitions, type ExtraComponents } from "./definitions.js";

export type { ExtraComponents }

export const base = fromRecord(definitions);
