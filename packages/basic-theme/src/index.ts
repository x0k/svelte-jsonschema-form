import { extendByRecord } from "@sjsf/form/lib/resolver";
import { fields } from '@sjsf/form/fields/resolver';
import "@sjsf/form/fields/exports";
import "@sjsf/form/templates/exports";

import { definitions } from "./definitions.js";
import "./components/exports.js";
import "./widgets/exports.js";

export const theme = extendByRecord(fields, definitions);
