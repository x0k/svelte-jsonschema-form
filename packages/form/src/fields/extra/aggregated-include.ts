import { definitions } from "../../resolver/definitions.js";

import Aggregated from "./aggregated.svelte";
import "./aggregated.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    aggregatedField: {};
  }
}

definitions.aggregatedField = Aggregated;
