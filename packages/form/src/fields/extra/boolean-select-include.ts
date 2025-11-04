import { definitions } from "../../theme/definitions.js";

import BooleanSelect from "./boolean-select.svelte";
import "./boolean-select.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    booleanSelectField: {};
  }
}

definitions.booleanSelectField = BooleanSelect;
