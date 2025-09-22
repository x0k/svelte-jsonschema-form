import { definitions } from "../resolver/definitions.js";

import Aggregated from "./aggregated.svelte";
import "./aggregated.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    aggregatedField: {};
  }
}

definitions.aggregatedField = Aggregated;
