import { definitions } from "../resolver/definitions.js";

import BooleanSelect from "./boolean-select.svelte";
import "./boolean-select.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    booleanSelectField: {};
  }
}

definitions.booleanSelectField = BooleanSelect;
