import { definitions } from "../../theme/definitions.js";

import ObjectRange from "./object-range.svelte";
import "./object-range.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    objectRangeField: {};
  }
}

definitions.objectRangeField = ObjectRange;
