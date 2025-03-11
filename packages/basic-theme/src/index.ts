import { extendByRecord } from "@sjsf/form/lib/resolver";
import { fields } from '@sjsf/form/fields/resolver';
import "@sjsf/form/fields/exports";
import "@sjsf/form/templates/exports";

import { definitions } from "./definitions.js";

export * as components from "./components/exports.js";
export * as widgets from "./widgets/exports.js";

export const theme = extendByRecord(fields, definitions);
