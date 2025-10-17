import { fromRecord } from "@/lib/resolver.js";

import "../fields/exports.js";
import "../templates/exports.js";

import { definitions } from "./definitions.js";

export const resolver = fromRecord(definitions);
