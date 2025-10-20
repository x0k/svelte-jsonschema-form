import { definitions } from "../../theme/definitions.js";

import Aggregated from "./aggregated.svelte";
import "./aggregated.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    aggregatedField: {};
  }
}

definitions.aggregatedField = Aggregated;
