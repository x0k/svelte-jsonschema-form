import { extendByRecord } from "@sjsf/form/lib/resolver";
import { fields } from "@sjsf/form/fields/resolver";

import { definitions } from "./definitions.js";

export const theme = extendByRecord(fields, definitions);
