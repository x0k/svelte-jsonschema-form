import { definitions } from "../../theme/definitions.js";

import Range from "./range.svelte";
import "./range.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    rangeField: {};
  }
}

definitions.rangeField = Range;
