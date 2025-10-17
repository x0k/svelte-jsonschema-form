import { fromRecord } from "@/lib/resolver.js";

import { definitions, type ExtraActions } from "./definitions.js";

export type { ExtraActions };

export const fieldActions = fromRecord(definitions);
