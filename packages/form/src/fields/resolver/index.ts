import { fromRecord } from "@/lib/resolver.js";

import "../exports.js";

import { definitions } from "./definitions.js";

export const fields = fromRecord(definitions);
