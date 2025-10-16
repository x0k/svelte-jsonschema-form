import { fromRecord } from "@/lib/resolver.js";

import { definitions } from "./definitions.js";

export const fieldActions = fromRecord(definitions);
